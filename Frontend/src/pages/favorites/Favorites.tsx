import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { WeatherCard } from "@/components/weatherCard/WeatherCard";
import styles from "./Favorites.module.css";
import { SearchBar } from "@/components/searchBar/SearchBar";

import { RequireLogin } from "../RequireLogin";
import { getWeather } from "@/services/weather.service";
import { Loader } from "@/components/loader/Loader";
import { userInfo } from "os";

export function Favorites() {
    const { user } = useAuth();

    const [weatherList, setWeatherList] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const cities = user?.favoriteCities ?? [];

    useEffect(() => {
        if (!user || cities.length === 0) {
            setWeatherList([]);
            return;
        }

        let isMounted = true;

        async function loadFavorites() {
            setLoading(true);

            try {
                const results = await Promise.all(
                    cities.map((city) => getWeather(city)),
                );

                if (isMounted) {
                    setWeatherList(results);
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        }

        loadFavorites();

        return () => {
            isMounted = false;
        };
    }, [user?.favoriteCities]);

    if (!user) {
        return <RequireLogin />;
    }

    return (
        <div className="weather-page-container">
            <div className="searchBar-container">
                <SearchBar />
            </div>

            <section className="weather-page-header">
                <h2>Favorites</h2>
            </section>

            <ul className="favorites-card">
                {loading && <Loader />}

                {!loading && cities.length === 0 && <p>Não há cidades</p>}

                {!loading &&
                    weatherList.map((d, i) => (
                        <WeatherCard key={cities[i]} data={weatherList[i]} />
                    ))}
            </ul>
        </div>
    );
}
