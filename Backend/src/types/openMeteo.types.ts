export type OpenMeteoError = {
    error: true;
    reason: string;
};

export type GeoResult = {
    name: string;
    id: number;
    latitude: number;
    longitude: number;
    country_code: string;
    country: string;
    admin1: string;
};

export type GeoResponse = {
    results: GeoResult[];
};

export type WeatherResponse = {
    current: {
        weathercode: number;
        temperature_2m: number;
        apparent_temperature: number;
        relative_humidity_2m: number;
        wind_speed_10m: number;
    };

    hourly: {
        time: string[];
        temperature_2m: number[];
        precipitation_probability: number[];
    };

    daily: {
        time: string[];
        temperature_2m_min: number[];
        temperature_2m_max: number[];
        precipitation_sum: number[];
        precipitation_probability_max: number[];
    };
};
