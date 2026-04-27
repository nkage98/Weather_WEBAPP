import express from "express";

import {
    authController,
    weatherController,
    userController,
} from "../main/container.ts";

import auth from "../middlewares/auth.middleware.ts";

const routes = express.Router();

// public routes
routes.post("/register", userController.register);

routes.post("/login", authController.login);

routes.get("/weather/:city", weatherController.weather);

routes.post("/auth/refresh", authController.refresh);

routes.get("/search/:city", weatherController.suggestLocations);

// private routes
routes.get("/user/", auth, userController.profile);

routes.put("/user/", auth, userController.update);

routes.delete("/user/delete", auth, authController.delete);

routes.post("/logout", auth, authController.logout);

routes.post("/favorite/add", auth, userController.addCity);

routes.post("/favorite/remove", auth, userController.removeCity);

export default routes;
