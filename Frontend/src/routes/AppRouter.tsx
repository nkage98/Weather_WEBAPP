import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { Home } from "@/pages/home/Home";
import { MainLayout } from "@/layouts/MainLayout";
import { Weather } from "@/pages/weather/Weather";
import { Login } from "@/pages/Login";
import { Register } from "@/pages/Register";
import { Favorites } from "@/pages/favorites/Favorites";
import { Profile } from "@/pages/profile/Profile";
import { NotFound } from "@/pages/notFound/NotFound";

function AppRouter() {
    return (
        <Routes>
            <Route element={<MainLayout />}>
                <Route index element={<Home />} />
                <Route path="weather/" element={<Weather />} />
                <Route path="login/" element={<Login />} />
                <Route path="register/" element={<Register />} />
                <Route path="favorites/" element={<Favorites />} />
                <Route path="profile/" element={<Profile />} />
                <Route path="*" element={<NotFound />} />
            </Route>
        </Routes>
    );
}

export { AppRouter };
