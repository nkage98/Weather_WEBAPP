import { Loader } from "@/components/loader/Loader";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";

export function Login() {
    const { error, user, loading, handleLogin } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loginError, setLoginError] = useState("");

    const navigate = useNavigate();

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (email.trim() === "" || password.trim() === "") return;

        const result = await handleLogin({ email, password });

        console.log(result);

        if (!result.success) {
            setLoginError(result.message || "Password or email is incorrect.");
            return;
        }

        navigate("/");
    }

    if (!!user) {
        navigate("/");
    }
    return (
        <div className="form-page-container">
            <div className="form-card">
                <h2 className="form-card_h2">Log in</h2>
                <form onSubmit={handleSubmit}>
                    <ul className="form-card_ul">
                        <li className="form-card_li">
                            <input
                                className="form-card_input"
                                type="email"
                                id="email"
                                name="email"
                                placeholder="E-mail"
                                value={email}
                                required
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </li>
                        <li className="form-card_li">
                            <input
                                className="form-card_input"
                                type="password"
                                id="password"
                                name="password"
                                placeholder="Password"
                                value={password}
                                required
                                minLength={8}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            {loginError && (
                                <p className="form-card_error">{loginError}</p>
                            )}
                        </li>
                        <button
                            className="form-card_button"
                            type="submit"
                            // disabled={disableButton}
                        >
                            {" "}
                            {loading ? <Loader /> : "Log in"}
                        </button>
                    </ul>
                </form>
                <p className="form-card_p">
                    Still don't have an account?{" "}
                    <NavLink className="register-link" to="/register">
                        Register here.
                    </NavLink>
                </p>
            </div>
        </div>
    );
}
