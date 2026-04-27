import { SearchBar } from "@/components/searchBar/SearchBar";
import styles from "./Home.module.css";

export function Home() {
    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Welcome to WeatherApp</h1>
            <div className={styles.searchBar}>
                <SearchBar />
            </div>

            <p className={styles.description}>
                Your go-to app for accurate and up-to-date weather information.
            </p>
        </div>
    );
}
