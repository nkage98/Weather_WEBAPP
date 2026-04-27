import { WeatherViewModel } from "@/types/weather.types";
import type { WeatherDTO } from "../types/weather.dto.types";

export type GeoResult = {
    name: string;
    latitude: number;
    longitude: number;
    country_code: string;
    country: string;
    admin1: string;
};

export function getIconUrl(icon: number) {
    const WEATHER_CODE_MAP: Record<number, { label: string; icon: string }> = {
        0: { label: "Clear sky", icon: "sunny" },
        1: { label: "Mainly clear", icon: "mostly_sunny" },
        2: { label: "Partly cloudy", icon: "mostly_cloudy" },
        3: { label: "Overcast", icon: "cloudy" },

        45: { label: "Fog", icon: "foggy" },
        48: { label: "Rime fog", icon: "foggy" },

        51: { label: "Light drizzle", icon: "drizzle" },
        53: { label: "Moderate drizzle", icon: "drizzle" },
        55: { label: "Dense drizzle", icon: "drizzle" },

        61: { label: "Light rain", icon: "showers" },
        63: { label: "Moderate rain", icon: "showers" },
        65: { label: "Heavy rain", icon: "heavy" },

        71: { label: "Light snow", icon: "flurries" },
        73: { label: "Moderate snow", icon: "scattered_snow" },
        75: { label: "Heavy snow", icon: "heavy_snow" },

        80: { label: "Rain showers", icon: "showers" },
        81: { label: "Heavy rain showers", icon: "heavy" },
        82: { label: "Violent rain showers", icon: "heavy" },

        95: { label: "Thunderstorm", icon: "strong_tstorms" },
        96: { label: "Thunderstorm with hail", icon: "strong_tstorms" },
        99: { label: "Heavy thunderstorm", icon: "strong_tstorms" },
    };
    const safeIcon = WEATHER_CODE_MAP[icon];

    console.log("Icon code:", icon, "Mapped to:", safeIcon);
    return {
        url: `https://maps.gstatic.com/weather/v1/${safeIcon.icon}.svg`,
        alt: safeIcon.label,
    };
}

export async function getWeather(
    city: string,
    cityId: string | undefined,
): Promise<WeatherViewModel> {
    try {
        const response = await fetch(
            `${import.meta.env.VITE_API_URL}weather/${city}${cityId ? `?cityId=${cityId}` : ""}`,
            {
                method: "GET",
                credentials: "include",
            },
        );

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error("City not found");
            }
            throw new Error("Failed to fetch Weather");
        }

        const data = await response.json();

        if (!isWeatherDTO(data.data)) {
            throw new Error("Response is not a valid");
        }

        const hourNow = new Date().getHours();
        return mapWeatherView(data.data, hourNow);
    } catch (error) {
        throw new Error(
            error instanceof Error ? error.message : "Unexpected error",
        );
    }
}

export function isWeatherDTO(obj: any): obj is WeatherDTO {
    return (
        obj &&
        typeof obj.location === "object" &&
        typeof obj.location.name === "string" &&
        typeof obj.current === "object" &&
        typeof obj.current.temperature === "number" &&
        typeof obj.current.weathercode === "number" &&
        Array.isArray(obj.daily) &&
        Array.isArray(obj.hourly)
    );
}

function formatHour(iso: string) {
    const date = new Date(iso);
    return `${date.getHours().toString().padStart(2, "0")}`;
}

function getWeekDay(dateStr: string) {
    const [year, month, day] = dateStr.split("-").map(Number);

    const date = new Date(year, month - 1, day); // mês começa em 0

    return date.toLocaleDateString("en", {
        weekday: "short",
    });
}

function mapWeatherView(dto: WeatherDTO, hourNow: number): WeatherViewModel {
    return {
        name: dto.location.name,
        latitude: dto.location.latitude,
        longitude: dto.location.longitude,
        country: dto.location.country,
        province: dto.location.province,
        today: {
            weathercode: dto.current.weathercode,
            temperature: `${Math.round(dto.current.temperature)}`,
            max: `${Math.round(dto.daily[0].max)}°C`,
            min: `${Math.round(dto.daily[0].min)}°C`,
            apparent_temperature: `${Math.round(dto.current.apparent_temperature)}°C`,
            Probability: `${Math.round(dto.daily[0].precipitationProbability)}%`,
            precipitation: `${dto.daily[0].precipitation} mm`,
            humidity: `${dto.current.humidity}%`,
            windSpeed: `${dto.current.windSpeed} km/h`,
            label: dto.current.description.label,
            icon: dto.current.description.icon,
        },
        daily: dto.daily.map((d) => ({
            day: d.time,
            weekday: getWeekDay(d.time),
            weathercode: d.weathercode,
            min: Math.round(d.min),
            max: Math.round(d.max),
            precipitation: d.precipitation,
            precipitationProbability: d.precipitationProbability,
        })),
        hourly: dto.hourly.slice(hourNow, hourNow + 24).map((h) => ({
            hour: formatHour(h.time),
            temperature: Math.round(h.temperature),
            rain: h.precipitationProbability,
        })),
    };
}

export async function getCities(city: string): Promise<GeoResult[]> {
    const response = await fetch(
        `${import.meta.env.VITE_API_URL}search/${city}`,
        {
            method: "GET",
            credentials: "include",
        },
    );

    const locations = await response.json();
    return locations.locations.results;
}

// export const getWeatherIcon = async (main: string) {
//       switch (main) {
//     case "Rain":
//       return RainIcon;
//     case "Clear":
//       return SunIcon;
//     case "Clouds":
//       return CloudIcon;
//     default:
//       return DefaultIcon;
//   }
// }
