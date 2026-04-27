import type {
    WeatherResponse,
    OpenMeteoError,
    GeoResponse,
} from "../types/openMeteo.types.ts";

export function isWeatherResponse(data: unknown): data is WeatherResponse {
    if (typeof data !== "object" || data === null) return false;

    const obj = data as any;

    return (
        typeof obj.current?.temperature_2m === "number" &&
        Array.isArray(obj.hourly?.time) &&
        Array.isArray(obj.daily?.time)
    );
}

export function isOpenMeteoError(data: any): data is OpenMeteoError {
    return data?.error === true && typeof data.reason === "string";
}

export function isValidGeoResponse(data: any): data is GeoResponse {
    return (
        data &&
        Array.isArray(data.results) &&
        data.results.length > 0 &&
        typeof data.results[0].name === "string" &&
        typeof data.results[0].latitude === "number" &&
        typeof data.results[0].longitude === "number"
    );
}
