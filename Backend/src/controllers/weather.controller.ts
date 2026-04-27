import type { WeatherService } from "../services/weather.service.ts";
import type { Request, Response } from "express";
import { AppError } from "../errors/app.error.ts";

export class WeatherController {
    constructor(private weatherService: WeatherService) {}

    weather = async (req: Request, res: Response): Promise<void> => {
        const { city } = req.params;
        const { cityId } = req.query;

        if (!city || city.trim() === "") {
            throw new AppError("City is required", 400);
        }

        const data = await this.weatherService.weather(city, cityId as string);

        res.status(200).json({ data });
    };

    suggestLocations = async (req: Request, res: Response): Promise<void> => {
        const { city } = req.params;

        if (!city || city.trim() === "") {
            throw new AppError("City is required", 400);
        }

        const locations = await this.weatherService.suggestLocations(city);

        res.status(200).json({ locations });
    };
}
