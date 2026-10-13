
import { Calendar, Droplets } from "lucide-react";
import * as LucideIcons from "lucide-react";
import {
    formatDate,
    formatTemperature,
    getWeatherIcon,
} from "../utils/weatherutils";

const WeatherForecast = ({ forecast, unit }) => {
    // Prevent errors when forecast data has not loaded yet
    if (!forecast?.list?.length) return null;

    // Group forecast entries by date
    const dailyForecast = forecast.list.reduce((acc, item) => {
        const date = new Date(item.dt * 1000).toDateString();

        if (!acc[date]) {
            acc[date] = {
                ...item,
                dayMin: item.main.temp_min,
                dayMax: item.main.temp_max,
                maxPop: item.pop ?? 0,
            };
        } else {
            acc[date].dayMin = Math.min(
                acc[date].dayMin,
                item.main.temp_min
            );

            acc[date].dayMax = Math.max(
                acc[date].dayMax,
                item.main.temp_max
            );

            acc[date].maxPop = Math.max(
                acc[date].maxPop,
                item.pop ?? 0
            );
        }

        return acc;
    }, {});

    const dailyItems = Object.values(dailyForecast).slice(0, 5);

    return (
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">

            {/* Header */}
            <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-white/10 rounded-full">
                    <Calendar className="w-6 h-6 text-white/80" />
                </div>

                <h2 className="text-2xl font-bold text-white">
                    5 Day Forecast
                </h2>
            </div>

            {/* Forecast Cards */}
            <div className="space-y-4">
                {dailyItems.map((item, index) => {
                    const iconName = getWeatherIcon(item.weather[0]);
                    const IconComponent =
                        LucideIcons[iconName] || LucideIcons.Cloud;

                    return (
                        <div
                            key={item.dt}
                            className="flex items-center justify-between gap-3 p-5 bg-white/5 backdrop-blur-sm rounded-2xl hover:bg-white/10 transition-all duration-300 group"
                        >
                            <div className="flex items-center gap-4 flex-1 min-w-0">
                                <div className="text-white/90 group-hover:text-white transform group-hover:scale-110 transition-all duration-300">
                                    <IconComponent size={40} />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="text-white font-semibold text-lg">
                                        {index === 0
                                            ? "Today"
                                            : formatDate(item.dt)}
                                    </div>

                                    <div className="text-white/70 text-sm capitalize font-medium">
                                        {item.weather[0].description}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2 text-white/60">
                                    <Droplets className="w-4 h-4 text-blue-300" />

                                    <span className="text-sm font-medium">
                                        {Math.round(item.maxPop * 100)}%
                                    </span>
                                </div>

                                <div className="text-right">
                                    <div className="text-white font-bold text-xl">
                                        {formatTemperature(item.dayMax, unit)}°{unit}
                                    </div>

                                    <div className="text-white/70 text-sm font-medium">
                                        {formatTemperature(item.dayMin, unit)}°{unit}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default WeatherForecast;
