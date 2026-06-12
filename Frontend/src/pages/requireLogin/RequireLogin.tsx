import { NavLink, useNavigate } from "react-router-dom";

export function RequireLogin() {
    return (
        <div className="require-page-container">
            <div className="require-page-card">
                <p className="require-page-text">
                    Login to have access to your favorite list
                </p>
                <NavLink className="require-page-link" to="/login">
                    Go to Login
                </NavLink>
            </div>
        </div>
    );
}
