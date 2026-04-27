import { Loader } from "@/components/loader/Loader";
import styles from "./Profile.module.css";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { ConfirmDialog } from "@/components/confirmDialog/ConfirmDialog";
import { useNavigate } from "react-router-dom";

export function Profile() {
    const { user, handleUpdate, handleDelete, loading } = useAuth();
    const [edit, setEdit] = useState(true);
    const [name, setName] = useState(user?.name ?? "");
    const [open, setOpen] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        if (user?.name) {
            setName(user.name);
        }
    }, [user]);

    if (!user) {
        return (
            <div className={styles.main_container}>
                <div className={styles.card}>
                    <Loader />;
                </div>
            </div>
        );
    }

    const email = user.email;
    const favCities = user.favoriteCities;
    const canSave = !edit && name.trim() !== "" && name !== user.name;

    async function handleDeleteAccount() {
        try {
            await handleDelete();
            navigate("/login");
        } catch (error) {
            alert("Failed to delete account");
        }
    }

    async function handleUpdateProfile(e: React.FormEvent) {
        e.preventDefault();
        try {
            if (name.trim() === "") {
                throw new Error("Name cannot be empty");
            }

            await handleUpdate(name);
            console.log("success");
            setEdit(true);
        } catch (error) {
            if (error instanceof Error) {
                alert(error.message);
            }
            alert("Unexpected Error");
        }
    }

    return (
        <div className={styles.main_container}>
            <div className={styles.card}>
                <h2 className={styles.card_h2}>Profile</h2>
                <div className={styles.profilePic_container}>
                    <div className={styles.profilePic}>
                        <img
                            src="https://i.pravatar.cc/300"
                            alt=""
                            width="300"
                            height="300"
                        />
                    </div>
                </div>

                <div className={styles.info_container}>
                    <div className={styles.info}>
                        <label className={styles.label}>Name</label>
                        <div className={styles.input_container}>
                            <input
                                className={styles.input}
                                type="text"
                                value={name}
                                disabled={edit}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />

                            <button
                                className={styles.edit_button}
                                type="button"
                                onClick={() => setEdit((prev) => !prev)}
                                data-state={edit}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                >
                                    <path d="M12 20h9" />
                                    <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
                                </svg>
                            </button>

                            <button
                                className={styles.save_button}
                                type="button"
                                disabled={!canSave}
                                onClick={handleUpdateProfile}
                            >
                                Save
                            </button>
                        </div>
                    </div>
                    <div className={styles.info}>
                        <label className={styles.label}>E-mail</label>
                        <input
                            className={styles.input}
                            type="email"
                            name="email"
                            value={email}
                            disabled={true}
                        />
                        {/* <p className={styles.email_p}>{email}</p> */}
                    </div>
                    <div className={styles.info_favorites}>
                        <label className={styles.label}>Favorite Cities</label>
                        <ul className={styles.favorites_ul}>
                            {favCities.map((city) => {
                                return (
                                    <li
                                        id={city}
                                        className={styles.favorites_li}
                                    >
                                        <span className={styles.city_name}>
                                            {city}
                                        </span>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>

                    <button
                        className={`${styles.button} ${styles.delete}`}
                        type="button"
                        onClick={() => setOpen(true)}
                    >
                        Delete Account
                    </button>
                </div>
            </div>
            <div>
                <ConfirmDialog
                    open={open}
                    title="Tem certeza?"
                    description="Essa ação é irreversível."
                    confirmText="Sim, deletar"
                    loading={loading}
                    onConfirm={handleDeleteAccount}
                    onCancel={() => setOpen(false)}
                />
            </div>
        </div>
    );
}
