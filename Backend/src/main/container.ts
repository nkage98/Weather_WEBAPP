import { AuthController } from "../controllers/auth.controller.ts";
import { UserController } from "../controllers/user.controller.ts";
import { WeatherController } from "../controllers/weather.controller.ts";
import { MongoUserRepository } from "../repositories/mongoUser.repository.ts";
import { MongoTokenRepository } from "../repositories/mongoToken.repository.ts";
import { AuthService } from "../services/auth.service.ts";
import { UserService } from "../services/user.service.ts";
import { WeatherService } from "../services/weather.service.ts";

const userRepo = new MongoUserRepository();
const tokenRepo = new MongoTokenRepository();

const authService = new AuthService(userRepo, tokenRepo);
const userService = new UserService(userRepo);
const weatherService = new WeatherService();
const authController = new AuthController(authService);
const userController = new UserController(userService);
const weatherController = new WeatherController(weatherService);

export { authController, userController, weatherController };
