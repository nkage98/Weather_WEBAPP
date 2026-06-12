import { useState } from "react";
import { register } from "@/services/user.service";

import { useNavigate, NavLink } from "react-router-dom";

export function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const rules = {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        number: /\d/.test(password),
        special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        try {
            await register({ name, email, password });
            console.log("success");
            navigate("/login");
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Failed to Register: ${error}`);
            }
            throw new Error("Unexpected Error");
        }
    }

    return (
        <div className="form-page-container">
            <div className="form-card">
                <h2 className="form-card_h2">Sign Up</h2>
                <form onSubmit={handleSubmit}>
                    <ul className="form-card_ul">
                        <li className="form-card_li">
                            <input
                                className="form-card_input"
                                type="text"
                                id="name"
                                name="name"
                                placeholder="Your Name"
                                value={name}
                                required
                                onChange={(e) => setName(e.target.value)}
                            />
                        </li>
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
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <ul className="password-rules">
                                <li className={rules.length ? "ok" : ""}>
                                    Minimum 8 characters
                                </li>
                                <li className={rules.uppercase ? "ok" : ""}>
                                    At least one uppercase letter
                                </li>
                                <li className={rules.number ? "ok" : ""}>
                                    At least one number
                                </li>
                                <li className={rules.special ? "ok" : ""}>
                                    At least one special character
                                </li>
                            </ul>
                        </li>

                        <button className="form-card_button" type="submit">
                            Register
                        </button>
                    </ul>
                </form>
                <p className="form-card_p">
                    Already have an account?{" "}
                    <NavLink className="" to="/login">
                        Login here.
                    </NavLink>
                </p>
            </div>
        </div>
    );
}
