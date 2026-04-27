import { useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { SearchBar } from "@/components/searchBar/SearchBar";
import { useWeather } from "@/hooks/useWeather";
import { Loader } from "@/components/loader/Loader";
import { WeatherMap } from "@/components/WeatherMap";
import { HourlyChart } from "@/components/hourlyChart/HourlyChart";
import { ErrorCard } from "@/components/errorCard/ErrorCard";

function getIconUrl(icon: number) {
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

    return {
        url: `https://maps.gstatic.com/weather/v1/${safeIcon.icon}.svg`,
        alt: safeIcon.label,
    };
}

export function Weather() {
    const { user, handleAddFav, handleRemoveFav } = useAuth();
    const [isFaved, setIsFaved] = useState(false);
    const [searchParams] = useSearchParams();
    const city = searchParams.get("city");
    const cityId = searchParams.get("cityId") || undefined;

    if (!city) {
        return <p>City not provided</p>;
    }

    const { data, loading, error } = useWeather(city, cityId);

    function handleFav(city: string): void {
        if (!user) {
            alert("You need to be logged in to use this feature.");
        }

        try {
            if (isFaved) {
                handleRemoveFav(city);
                setIsFaved(false);
            } else {
                handleAddFav(city);
                setIsFaved(true);
            }
        } catch (error) {
            alert("Failed to update favorite. Please try again.");
        }
    }

    useEffect(() => {
        console.log(data);
        if (!user || !data) return;
        if (user) {
            setIsFaved(user.favoriteCities.includes(data.name));
        }
    }, [user, data]);

    if (loading)
        return (
            <div className="weather-page-container">
                <div className="searchBar-container">
                    <SearchBar />
                    <Loader />
                </div>
            </div>
        );

    if (error && !data)
        return (
            <div className="weather-page-container">
                <div className="searchBar-container">
                    <SearchBar />
                </div>
                <ErrorCard message={error || "An error occurred"} />
            </div>
        );

    return (
        <div className="weather-page-container">
            <div className="searchBar-container">
                <SearchBar />
            </div>

            <section className="weather-page-header">
                <div>
                    <h2 className="weather-page_h2">{data?.name}</h2>
                    <p className="weather-page_p">{data?.country}</p>
                </div>
                <div className="favorite-button-container">
                    <p className="favorite-button-container_p">save</p>
                    <button
                        className={`star-toggle ${isFaved ? "faved" : ""}`}
                        disabled={loading}
                        onClick={() => handleFav(data.name)}
                        aria-label="Toggle favorite"
                    >
                        ★
                    </button>
                </div>
            </section>
            <article className="current-container">
                <section className="current-card">
                    <h3 className="current-card_h3">Now</h3>
                    <section className="current-weather">
                        <div className="current-temp">
                            <img
                                className="current-temp-icon"
                                title={
                                    getIconUrl(data?.today.weathercode || 0).alt
                                }
                                width="200"
                                height="200"
                                src={
                                    getIconUrl(data?.today.weathercode || 0).url
                                }
                                alt={
                                    getIconUrl(data?.today.weathercode || 0).alt
                                }
                            />
                            <p className="current-temp-value">
                                {data?.today.temperature || 0}
                                <span className="current-temp-value_span">
                                    °C
                                </span>
                            </p>
                        </div>
                        <div className="current-desc">
                            <p className="current-desc-text">
                                {getIconUrl(data?.today.weathercode || 0).alt}
                            </p>
                            <p className="current-feels-like">
                                Feels like{" "}
                                {data?.today.apparent_temperature || 0}
                            </p>
                        </div>
                    </section>

                    <section className="current-details">
                        <ul className="current-details_ul">
                            <li className="current-details_li">
                                <p className="current-details-titles">Max</p>
                                <p>{data?.today.max || 0}</p>
                            </li>
                            <li className="current-details_li">
                                <p className="current-details-titles">Min</p>
                                <p>{data?.today.min || 0}</p>
                            </li>

                            <li className="current-details_li">
                                <p className="current-details-titles">
                                    Probability
                                </p>
                                <p className="">
                                    {data?.today.Probability || 0}
                                </p>
                            </li>
                            <li className="current-details_li">
                                <p className="current-details-titles">
                                    Precipitation
                                </p>
                                <p className="">
                                    {data?.today.precipitation || 0}
                                </p>
                            </li>

                            <li className="current-details_li">
                                <p className="current-details-titles">
                                    Humidity
                                </p>
                                <p className="current-humidity">
                                    {data?.today.humidity}
                                </p>
                            </li>
                            <li className="current-details_li">
                                <p className="current-details-titles">Wind</p>
                                <p className="">{data?.today.windSpeed}</p>
                            </li>
                        </ul>
                    </section>
                </section>
                <section className="map-container">
                    <div className="map">
                        {data && (
                            <WeatherMap
                                lat={data.latitude}
                                lon={data.longitude}
                                city={data.name}
                            />
                        )}
                    </div>
                </section>
            </article>
            <article className="chart-container">
                <h3 className="chart-container_h3">Hourly Forecast</h3>
                <div className="chart">
                    <HourlyChart data={data?.hourly} />
                </div>
            </article>
            <article className="forecast-container">
                <h3 className="forecast_h3">Daily Forecast</h3>
                <div className="forecast">
                    <ul className="forecast_ul">
                        {data?.daily.map((day) => (
                            <li key={day.day} className="forecast_li">
                                <strong className="forecast-day">
                                    {day.weekday} {day.day.slice(5, 7)}/
                                    {day.day.slice(8, 10)}
                                </strong>
                                <img
                                    className="forecast-icon"
                                    title={
                                        getIconUrl(data?.today.weathercode || 0)
                                            .alt
                                    }
                                    width="200"
                                    height="200"
                                    src={
                                        getIconUrl(data?.today.weathercode).url
                                    }
                                    alt={
                                        getIconUrl(data?.today.weathercode).alt
                                    }
                                />
                                <div className="forecast-temp">
                                    <span>🌡️</span>
                                    <span className="forecast-temp-max">
                                        {day.max}°C
                                    </span>{" "}
                                    <span>🌡</span>
                                    <span className="forecast-temp-min">
                                        {day.min}°C
                                    </span>
                                </div>
                                <div className="forecast-rain">
                                    <span>💧</span>
                                    <span>{day.precipitationProbability}%</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </article>
        </div>
    );
}
