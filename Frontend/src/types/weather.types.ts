export type WeatherViewModel = {
    name: string;
    latitude: number;
    longitude: number;
    country: string;
    province: string;
    today: Today;
    daily: Daily[];
    hourly: Hourly[];
};

export type Today = {
    weathercode: number;
    temperature: string;
    max: string;
    min: string;
    apparent_temperature: string;
    Probability: string;
    precipitation: string;
    humidity: string;
    windSpeed: string;
    label: string;
    icon: string;
};

export type Daily = {
    day: string;
    weekday: string;
    weathercode: number;
    min: number;
    max: number;
    precipitation: number;
    precipitationProbability: number;
};

export type Hourly = {
    hour: string;
    temperature: number;
    rain: number;
};
