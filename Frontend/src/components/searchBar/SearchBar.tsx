import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDebounce } from "../../hooks/useDebounce";
import styles from "./SearchBar.module.css";
import { useSearchCities } from "@/hooks/useWeather";

export function SearchBar() {
    const [cityInput, setCityInput] = useState("");
    const [open, setOpen] = useState(false);
    const debouncedCityInput = useDebounce(cityInput, 500);

    const { data } = useSearchCities(debouncedCityInput);
    const menuRef = useRef<HTMLUListElement>(null);

    const navigate = useNavigate();

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (!open) return;

            if (!(event.target instanceof Node)) return;

            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setOpen(false);
            }
        }

        document.addEventListener("click", handleClickOutside);

        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, [open]);

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (!cityInput.trim()) return;

        const city = cityInput.trim().toLowerCase() || "";

        navigate(`/weather?city=${encodeURIComponent(city)}`);
        setOpen(false);
        setCityInput("");
    }

    return (
        <div className={styles.container}>
            <form onSubmit={handleSubmit} className={styles.forms}>
                <div className={styles.searchBar}>
                    <button type="submit" className={styles.searchBar_button}>
                        <svg className={styles.lupeIcon} viewBox="0 0 24 24">
                            <circle
                                cx="11"
                                cy="11"
                                r="8"
                                stroke="currentColor"
                                strokeWidth="2"
                                fill="none"
                            />
                            <line
                                x1="21"
                                y1="21"
                                x2="16.65"
                                y2="16.65"
                                stroke="currentColor"
                                strokeWidth="2"
                            />
                        </svg>
                    </button>
                    <input
                        type="text"
                        placeholder="Enter city name"
                        className={styles.searchBar_input}
                        value={cityInput}
                        onChange={(e) => {
                            setCityInput(e.target.value);
                            setOpen(true);
                        }}
                    />
                </div>
                {data && (
                    <ul
                        ref={menuRef}
                        className={`${styles.suggestions_ul} ${open ? styles.open : ""}
                `}
                    >
                        {data.map((loc: any) => (
                            <li className={styles.suggestions_li} key={loc.id}>
                                <button
                                    className={styles.suggestions_button}
                                    onClick={() => {
                                        const city = loc.name.toLowerCase();
                                        navigate(
                                            `/weather?city=${encodeURIComponent(city)}&cityId=${loc.id}`,
                                        );
                                        setOpen(false);
                                        setCityInput("");
                                    }}
                                >
                                    {loc.name}, {loc.admin1}, {loc.country}
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </form>
        </div>
    );
}
