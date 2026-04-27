import { useWeather } from "@/hooks/useWeather";
import { Loader } from "../loader/Loader";
import styles from "./WeatherCard.module.css";
import type { WeatherViewModel } from "@/types/weather.types";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { refresh, removeFavorite } from "@/services/user.service";
import { useAuth } from "@/contexts/AuthContext";

type WeatherCardProps = {
    data: WeatherViewModel;
};

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

export function WeatherCard({ data }: WeatherCardProps) {
    const { handleRemoveFav } = useAuth();
    const [collapsed, setCollapsed] = useState(true);
    const navigate = useNavigate();
    const city = data.name;

    function handleDetails() {
        if (!city) {
            return;
        }
        navigate(`/weather?city=${city}`);
    }

    function handleDelete() {
        try {
            handleRemoveFav(city);
            navigate("/Favorites");
        } catch {}
    }

    return (
        <div>
            <li
                className={`${styles.card} ${
                    collapsed ? styles.collapsed : styles.expanded
                }`}
                onClick={() => setCollapsed((prev) => !prev)}
                role="button"
                aria-expanded={!collapsed}
            >
                <div className={styles.summary}>
                    <div className={styles.summaryLeft}>
                        <header className={styles.header}>
                            <h3 className={styles.cityName}>{data.name}</h3>
                        </header>
                        <img
                            className={styles.summaryIcon}
                            src={getIconUrl(data?.today.weathercode || 0).url}
                            alt={getIconUrl(data?.today.weathercode || 0).alt}
                        />

                        <div className={styles.summaryTemp}>
                            <p className={styles.summaryTempMax}>
                                🌡️{data?.today.temperature || 0}°C
                            </p>

                            <p className={styles.summaryTempMin}>
                                <span>🌡</span>
                                {data?.today.min || 0}
                            </p>
                        </div>
                    </div>
                    <p className={styles.summaryProb}>
                        💧{data?.today.Probability || 0}
                    </p>

                    <button
                        className={styles.toggle}
                        onClick={(e) => {
                            e.stopPropagation();
                            setCollapsed((prev) => !prev);
                        }}
                        aria-label="Toggle card"
                    >
                        <span className={styles.arrow_after} />
                    </button>
                </div>

                <div className={styles.card_container}>
                    <div className={styles.header_container}>
                        <header className={styles.header}>
                            <h3 className={styles.cityName}>{data?.name}</h3>
                        </header>
                        <button
                            className={styles.toggle}
                            onClick={(e) => {
                                e.stopPropagation();
                                setCollapsed((prev) => !prev);
                            }}
                            aria-label="Toggle card"
                        >
                            <span className={styles.arrow_before} />
                        </button>
                    </div>

                    <section className={styles.weather}>
                        <div className={styles.temp}>
                            <img
                                className={styles.icon}
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
                            <p className={styles.currentTemp}>
                                {data?.today.temperature || 0}
                                <span className={styles.currentTemp_span}>
                                    °C
                                </span>
                            </p>
                        </div>
                        <div className={styles.sideInfo}>
                            <p className={styles.description}>
                                {getIconUrl(data?.today.weathercode || 0).alt}
                            </p>
                            <p className={styles.feelsLike}>
                                Feels like{" "}
                                {data?.today.apparent_temperature || 0}
                            </p>
                        </div>
                    </section>

                    <section className={styles.details}>
                        <ul className={styles.details_ul}>
                            <li className={styles.details_li}>
                                <p className={styles.detailsTitles}>Max</p>
                                <p>{data?.today.max || 0}</p>
                            </li>
                            <li className={styles.details_li}>
                                <p className={styles.detailsTitles}>Min</p>
                                <p>{data?.today.min || 0}</p>
                            </li>

                            <li className={styles.details_li}>
                                <p className={styles.detailsTitles}>
                                    Probability
                                </p>
                                <p className="">
                                    {data?.today.Probability || 0}
                                </p>
                            </li>
                            <li className={styles.details_li}>
                                <p className={styles.detailsTitles}>
                                    Precipitation
                                </p>
                                <p className="">
                                    {data?.today.precipitation || 0}
                                </p>
                            </li>

                            <li className={styles.details_li}>
                                <p className={styles.detailsTitles}>Humidity</p>
                                <p className={styles.humidity}>
                                    {data?.today.humidity}
                                </p>
                            </li>
                            <li className={styles.details_li}>
                                <p className={styles.detailsTitles}>Wind</p>
                                <p className="">{data?.today.windSpeed}</p>
                            </li>
                        </ul>
                    </section>
                    <div className={styles.button_container}>
                        <button
                            className={styles.details_button}
                            onClick={handleDetails}
                        >
                            <p>Details</p>
                        </button>
                        <button
                            className={styles.delete_button}
                            onClick={handleDelete}
                        >
                            <p>Delete</p>
                        </button>
                    </div>
                </div>
            </li>
        </div>
    );
}
