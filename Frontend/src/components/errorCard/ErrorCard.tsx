import styles from "./ErrorCard.module.css";

export function ErrorCard({ message }: { message: string }) {
    return (
        <div className={styles.errorCard}>
            <div className={styles.errorMessage}>{message}</div>
        </div>
    );
}
