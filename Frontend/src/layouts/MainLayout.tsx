import { Outlet } from "react-router-dom";
import { Header } from "@/components/header/Header";
import { Footer } from "@/components/Footer";

export function MainLayout() {
    return (
        <div className="page-container">
            <Header />
            <main className="main-container">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}
