import styles from "./Loader.module.css";

export function Loader() {
    return (
        <div className={styles.loader_container}>
            <div className={styles.loading}>
                <span />
                <span />
                <span />
            </div>
        </div>
    );
}
