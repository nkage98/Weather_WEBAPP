import { Hourly } from "@/types/weather.types";
import {
    Line,
    CartesianGrid,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

import { useState } from "react";

type HourlyChartProps = {
    data: Hourly[];
};

export function HourlyChart({ data }: HourlyChartProps) {
    const [width, setWidth] = useState(0);
    return (
        <ResponsiveContainer
            width="100%"
            height="100%"
            onResize={(w) => setWidth(w)}
        >
            <AreaChart data={data}>
                <defs>
                    <linearGradient
                        id="rainGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                    >
                        <stop
                            offset="0%"
                            stopColor="#4dabf7"
                            stopOpacity={0.8}
                        />
                        <stop
                            offset="100%"
                            stopColor="#4dabf7"
                            stopOpacity={0.05}
                        />
                    </linearGradient>
                </defs>

                <XAxis
                    dataKey="hour"
                    unit="h"
                    tick={{ fill: "#ffffff", opacity: 0.8 }}
                    height={40}
                />

                <YAxis
                    yAxisId="left"
                    tick={{ fill: "#ffffff", opacity: 0.8 }}
                    unit="°C"
                    width={40}
                />
                {width > 400 && (
                    <YAxis
                        yAxisId="right"
                        width={40}
                        mirror={width <= 400}
                        tick={{ fill: "#ffffff", opacity: 0.8 }}
                        orientation="right"
                        domain={[0, 100]}
                        unit="%"
                    />
                )}

                <CartesianGrid stroke="rgba(255,255,255,0.05)" />
                <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="temperature"
                    stroke="#ff6b6b"
                    strokeWidth={2}
                    dot={false}
                />
                <Area
                    yAxisId="right"
                    type="monotone"
                    connectNulls={true}
                    dataKey="rain"
                    baseValue={0}
                    fill="url(#rainGradient)"
                    stroke="#4dabf7"
                    strokeWidth={2}
                />

                <Tooltip
                    contentStyle={{
                        backgroundColor: "#0f172a", // fundo
                        border: "none",
                        borderRadius: 8,
                    }}
                    labelStyle={{
                        color: "#e5e7eb", // COR DAS HORAS ⬅️
                        fontWeight: 600,
                    }}
                    formatter={(value, name) => {
                        if (value == null) return ["-", name];

                        if (name === "rain") {
                            return [`${value}%`, "Rain Probability"];
                        }

                        if (name === "temperature") {
                            return [`${value}°C`, "Temperature"];
                        }

                        return [String(value), name];
                    }}
                />
            </AreaChart>
        </ResponsiveContainer>
    );
}
