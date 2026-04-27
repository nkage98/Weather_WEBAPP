import React from "react";
import styles from "./ConfirmDialog.module.css";

type ConfirmDialogProps = {
    open: boolean;
    title: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
    loading?: boolean;
    onConfirm: () => void;
    onCancel: () => void;
};

export function ConfirmDialog({
    open,
    title,
    description,
    confirmText = "Confirmar",
    cancelText = "Cancelar",
    loading = false,
    onConfirm,
    onCancel,
}: ConfirmDialogProps) {
    if (!open) return null;

    return (
        <div className={styles.overlayStyle}>
            <div className={styles.modalStyle}>
                <h2>{title}</h2>
                <p>{description}</p>

                <div className={styles.actionsStyle}>
                    <button
                        className={styles.button}
                        onClick={onCancel}
                        disabled={loading}
                    >
                        {cancelText}
                    </button>

                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        className={`${styles.button} ${styles.deleteButton}`}
                    >
                        {loading ? "Carregando..." : confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}
