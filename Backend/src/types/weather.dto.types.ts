export type HourlyWeatherDTO = {
    time: string;
    temperature: number;
    precipitationProbability: number;
};

export type DailyWeatherDTO = {
    time: string;
    weathercode: number;
    min: number;
    max: number;
    precipitation: number;
    precipitationProbability: number;
};

export type WeatherDTO = {
    location: {
        name: string;
        latitude: number;
        longitude: number;
        country_code: string;
        country: string;
        province: string;
    };
    current: {
        weathercode: number;
        temperature: number;
        apparent_temperature: number;
        humidity: number;
        windSpeed: number;
        description: {
            label: string;
            icon: string;
        };
    };
    daily: DailyWeatherDTO[];
    hourly: HourlyWeatherDTO[];
};
