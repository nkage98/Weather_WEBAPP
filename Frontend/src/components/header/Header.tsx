import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import styles from "./Header.module.css";

export function Header() {
    const { user, error, handleLogout } = useAuth();
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();
    const menuRef = useRef<HTMLUListElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (!open) return;

            if (!(event.target instanceof Node)) return;

            if (
                menuRef.current &&
                !menuRef.current.contains(event.target) &&
                buttonRef.current &&
                !buttonRef.current.contains(event.target)
            ) {
                setOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [open]);

    async function handleSubmit(): Promise<void> {
        try {
            await handleLogout();
            setOpen(false);
            navigate("/");
        } catch {}
    }

    function toggleMenu() {
        setOpen(!open);
    }

    return (
        <header className={styles.header}>
            <nav className={styles.header_nav}>
                <ul className={`${styles.header_ul} noDecoration`}>
                    <li className={styles.header_li}>
                        <NavLink
                            className={styles.header_title}
                            to="/"
                            onClick={() => setOpen(false)}
                        >
                            Weather App
                        </NavLink>
                    </li>
                    <li className={styles.header_li}>
                        <NavLink
                            className={styles.header_link}
                            to="/Favorites"
                            onClick={() => setOpen(false)}
                        >
                            Favorites
                        </NavLink>
                    </li>
                </ul>

                <ul className={`${styles.header_ul} noDecoration`}>
                    {!user && (
                        <>
                            <li className={styles.header_li}>
                                <NavLink
                                    className={styles.header_link}
                                    to="/login"
                                    onClick={() => setOpen(false)}
                                >
                                    Log in
                                </NavLink>
                            </li>
                            <li className={styles.header_li}>
                                <NavLink
                                    className={styles.header_link}
                                    to="/register"
                                    onClick={() => setOpen(false)}
                                >
                                    Sign Up
                                </NavLink>
                            </li>
                        </>
                    )}
                    {user && (
                        <>
                            <li className={styles.header_li}>
                                <p>
                                    Olá,{" "}
                                    <NavLink
                                        className={styles.header_link}
                                        to="/Profile"
                                        onClick={() => setOpen(false)}
                                    >
                                        {user?.name ?? "User"}
                                    </NavLink>
                                </p>
                            </li>
                            <li className={styles.header_li}>
                                <button
                                    className={styles.header_button}
                                    onClick={handleSubmit}
                                >
                                    <p className={styles.logout}>Log out</p>
                                </button>
                            </li>
                        </>
                    )}
                </ul>
            </nav>
            <div className={styles.mobile_header_nav}>
                <NavLink className={styles.header_title} to="/">
                    Weather App
                </NavLink>

                {!user && (
                    <NavLink
                        className={styles.header_link}
                        to="/login"
                        onClick={() => setOpen(false)}
                    >
                        Log in
                    </NavLink>
                )}

                {user && (
                    <>
                        <button
                            ref={buttonRef}
                            className={`${styles.hamburger} ${open ? styles.active : ""}`}
                            onClick={toggleMenu}
                        >
                            <span></span>
                            <span></span>
                            <span></span>
                        </button>

                        <ul
                            ref={menuRef}
                            className={`${styles.mobile_header_ul} ${open ? styles.open : ""} noDecoration
                `}
                        >
                            <li className={styles.header_li}>
                                <NavLink
                                    className={styles.header_link}
                                    to="/Profile"
                                    onClick={() => setOpen(false)}
                                >
                                    Profile
                                </NavLink>
                            </li>

                            <li className={styles.header_li}>
                                <NavLink
                                    className={styles.header_link}
                                    to="/Favorites"
                                    onClick={() => setOpen(false)}
                                >
                                    Favorites
                                </NavLink>
                            </li>

                            <li className={styles.header_li}>
                                <button
                                    className={styles.header_button}
                                    onClick={handleSubmit}
                                >
                                    Log out
                                </button>
                            </li>
                        </ul>
                    </>
                )}
            </div>
        </header>
    );
}
