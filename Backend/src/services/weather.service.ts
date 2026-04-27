import type { GeoResponse, WeatherResponse } from "../types/openMeteo.types.ts";
import type {
    WeatherDTO,
    HourlyWeatherDTO,
    DailyWeatherDTO,
} from "../types/weather.dto.types.ts";
import {
    isValidGeoResponse,
    isOpenMeteoError,
    isWeatherResponse,
} from "../validators/weather.validators.ts";
import { AppError } from "../errors/app.error.ts";
// import { redisClient } from "../main/cache.ts";
import Redis from "ioredis-mock";

type WeatherDescription = {
    label: string;
    icon: string;
};

const WEATHER_CODE_MAP: Record<number, WeatherDescription> = {
    0: { label: "Clear sky", icon: "sun" },
    1: { label: "Mainly clear", icon: "sun-cloud" },
    2: { label: "Partly cloudy", icon: "cloud-sun" },
    3: { label: "Overcast", icon: "cloud" },
    61: { label: "Light rain", icon: "rain" },
    63: { label: "Moderate rain", icon: "rain" },
    65: { label: "Heavy rain", icon: "storm" },
};

const redisClient = new Redis();

export class WeatherService {
    private readonly DEFAULT_WEATHER: WeatherDescription = {
        label: "Unknown",
        icon: "cloud",
    };

    private mapHourly(data: WeatherResponse): HourlyWeatherDTO[] {
        return data.hourly.time.map((time, i) => ({
            time,
            temperature: data.hourly.temperature_2m[i],
            precipitationProbability: data.hourly.precipitation_probability[i],
        }));
    }

    private mapDaily(data: WeatherResponse): DailyWeatherDTO[] {
        return data.daily.time.map((time, i) => ({
            time,
            weathercode: data.current.weathercode,
            min: data.daily.temperature_2m_min[i],
            max: data.daily.temperature_2m_max[i],
            precipitation: data.daily.precipitation_sum[i],
            precipitationProbability:
                data.daily.precipitation_probability_max[i],
        }));
    }

    private mapWeatherToDTO(
        data: WeatherResponse,
        geo: GeoResponse,
    ): WeatherDTO {
        return {
            location: {
                name: geo.results[0].name,
                latitude: geo.results[0].latitude,
                longitude: geo.results[0].longitude,
                country_code: geo.results[0].country_code,
                country: geo.results[0].country,
                province: geo.results[0].admin1,
            },
            current: {
                weathercode: data.current.weathercode,
                temperature: data.current.temperature_2m,
                apparent_temperature: data.current.apparent_temperature,
                humidity: data.current.relative_humidity_2m,
                windSpeed: data.current.wind_speed_10m,
                description:
                    WEATHER_CODE_MAP[data.current.weathercode] ??
                    this.DEFAULT_WEATHER,
            },
            daily: this.mapDaily(data),
            hourly: this.mapHourly(data),
        };
    }

    private async getGeoloc(
        city: string,
        cityId: string | undefined,
    ): Promise<GeoResponse> {
        if (!cityId) {
            const geoURL = `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=en&format=json`;

            const geoResponse = await fetch(geoURL);

            const location = await geoResponse.json();

            if (!isValidGeoResponse(location)) {
                throw new AppError("City not found", 404);
            }

            return location;
        }

        const geoURL = `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=5&language=en&format=json`;

        const geoResponse = await fetch(geoURL);

        const location = await geoResponse.json();

        if (!isValidGeoResponse(location)) {
            throw new AppError("City not found", 404);
        }

        const matched = location.results.find(
            (loc) => String(loc.id) === cityId,
        );

        if (!matched) {
            throw new AppError("City not found", 404);
        }

        return { results: [matched] };
    }

    async weather(
        city: string,
        cityId: string | undefined,
    ): Promise<WeatherDTO> {
        if (typeof city !== "string" || city.trim() === "") {
            throw new AppError("Invalid Input", 400);
        }

        const location = await this.getGeoloc(city, cityId);

        //cache aqui para o location.id
        const cacheKey = `weather:${location.results[0].id}`;
        const cached = await redisClient.get(cacheKey);

        if (cached) {
            console.log("Cache hit for", cacheKey);
            return JSON.parse(cached.toString());
        }

        const { latitude: lat, longitude: lon } = location.results[0];

        const weatherURL = new URL(`https://api.open-meteo.com/v1/forecast`);
        const current =
            "weathercode,temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m";
        const daily =
            "weathercode,temperature_2m_min,temperature_2m_max,precipitation_sum,precipitation_probability_max";
        const hourly = "temperature_2m,precipitation_probability";

        weatherURL.search = new URLSearchParams({
            latitude: String(lat),
            longitude: String(lon),
            current,
            daily,
            hourly,
            timezone: "auto",
        }).toString();

        const response = await fetch(weatherURL);

        const data = await response.json();

        console.log("Fetched weather");

        if (isOpenMeteoError(data)) {
            throw new AppError(data.reason, 400);
        }

        if (!isWeatherResponse(data)) {
            throw new AppError("Invalid Response", 400);
        }

        const mapped = this.mapWeatherToDTO(data, location);

        await redisClient.set(cacheKey, JSON.stringify(mapped), "EX", 60);

        return mapped;
    }

    async suggestLocations(city: string): Promise<GeoResponse> {
        if (typeof city !== "string" || city.trim() === "") {
            throw new AppError("Invalid Input", 400);
        }

        const geoURL = `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=5&language=en&format=json`;
        const geoResponse = await fetch(geoURL);

        const locations = await geoResponse.json();

        if (!isValidGeoResponse(locations)) {
            throw new AppError("City not found", 404);
        }

        return locations;
    }
}

//done
