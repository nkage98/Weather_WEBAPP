import { useEffect, useState } from "react";
import { GeoResult, getCities, getWeather } from "@/services/weather.service";
import { WeatherViewModel } from "@/types/weather.types";

export function useWeather(city: string, cityId: string | undefined) {
    const [data, setData] = useState<WeatherViewModel | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!city) return;

        let isCancelled = false;

        async function fetchWeather() {
            try {
                setLoading(true);
                setError(null);

                const response = await getWeather(city, cityId);

                if (!isCancelled) {
                    setData(response);
                }
            } catch (err) {
                if (!isCancelled) {
                    setData(null);
                    if (err instanceof Error) {
                        setError(err.message);
                    } else {
                        setError("Unexpected error");
                    }
                }
            } finally {
                if (!isCancelled) {
                    setLoading(false);
                }
            }
        }

        fetchWeather();

        return () => {
            isCancelled = true;
        };
    }, [city]);

    return { data, loading, error };
}

export function useSearchCities(city: string) {
    const [data, setData] = useState<GeoResult[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!city) return setData(null);

        let isCancelled = false;

        async function fetchCities() {
            try {
                setLoading(true);
                setError(null);

                const response = await getCities(city);

                if (!isCancelled) {
                    setData(response);
                }
            } catch (err) {
                if (!isCancelled) {
                    setData(null);
                    if (err instanceof Error) {
                        setError(err.message);
                    } else {
                        setError("Unexpected error");
                    }
                }
            } finally {
                if (!isCancelled) {
                    setLoading(false);
                }
            }
        }

        fetchCities();

        return () => {
            isCancelled = true;
        };
    }, [city]);

    return { data, loading, error };
}
