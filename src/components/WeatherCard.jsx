import { MapPin, Sunrise, Sunset, Eye, Wind, Droplets, Gauge, Thermometer } from "lucide-react"
import {
    getWeatherIcon,
    formatTemperature,
    formatTime,
    formatDate,
} from "../utils/weatherutils";
import * as LucideIcons from "lucide-react";



const WeatherCard = ({ weather, unit }) => {
    if (!weather) return null;

    const iconName = getWeatherIcon(weather.weather[0]);
    const IconComponent =
        LucideIcons[iconName] || LucideIcons.Cloud;

    const weatherStats = [
        {
            icon: Eye,
            label: "Visibility",
            value: `${(weather.visibility / 1000).toFixed(1)} km`,
            color: "text-blue-300",
        },
        {
            icon: Wind,
            label: "Wind Speed",
            value: `${weather.wind.speed.toFixed(1)} m/s`,
            color: "text-green-300",
        },
        {
            icon: Droplets,
            label: "Humidity",
            value: `${weather.main.humidity}%`,
            color: "text-cyan-300",
        },
        {
            icon: Gauge,
            label: "Pressure",
            value: `${weather.main.pressure} hPa`,
            color: "text-purple-300",
        },
        {
            icon: Thermometer,
            label: "Feels Like",
            value: `${formatTemperature(
                weather.main.feels_like,
                unit
            )}°${unit}`,
            color: "text-orange-300",
        },
    ];

    return (
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">

            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/10 rounded-full">
                        <MapPin className="text-white/80 w-5 h-5" />
                    </div>

                    <div>
                        <h2 className="text-white font-semibold text-lg">
                            {weather.name}
                        </h2>

                        <p className="text-white/60 text-sm">
                            {weather.sys.country}
                        </p>
                    </div>
                </div>

                <div className="text-right text-white/70 text-sm">
                    <p>{formatDate(weather.dt)}</p>
                    <p>{formatTime(weather.dt)}</p>
                </div>
            </div>

            {/* Main Weather Display */}
            <div className="flex items-center justify-between gap-4 mb-10">
                <div>
                    <div className="text-5xl sm:text-7xl font-bold text-white mb-3">
                        {formatTemperature(
                            weather.main.temp,
                            unit
                        )}°{unit}
                    </div>

                    <div className="text-white/90 text-xl capitalize mb-2">
                        {weather.weather[0].description}
                    </div>

                    <div className="flex flex-wrap gap-4 text-white/60 text-sm">
                        <span>
                            H: {formatTemperature(
                                weather.main.temp_max,
                                unit
                            )}°{unit}
                        </span>

                        <span>
                            L: {formatTemperature(
                                weather.main.temp_min,
                                unit
                            )}°{unit}
                        </span>
                    </div>
                </div>

                <div className="text-white">
                    <IconComponent className="w-20 h-20 sm:w-28 sm:h-28" />
                </div>
            </div>

            {/* Weather Statistics */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {weatherStats.map((stat) => {
                    const StatIcon = stat.icon;

                    return (
                        <div
                            key={stat.label}
                            className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 hover:bg-white/10 transition-all group"
                        >
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 rounded-full bg-white/10 group-hover:bg-white/20">
                                    <StatIcon
                                        className={`w-4 h-4 ${stat.color}`}
                                    />
                                </div>

                                <span className="text-white/70 text-sm font-medium">
                                    {stat.label}
                                </span>
                            </div>

                            <div className="text-white font-semibold text-lg pl-11">
                                {stat.value}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Sunrise and Sunset */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-linear-to-r from-orange-500/20 to-yellow-500/20 rounded-2xl p-4 border border-orange-400/20">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-orange-400/20 rounded-full">
                            <Sunrise className="w-4 h-4 text-orange-300" />
                        </div>

                        <span className="text-white text-sm font-medium">
                            Sunrise
                        </span>
                    </div>

                    <div className="text-white font-semibold text-lg pl-11">
                        {formatTime(weather.sys.sunrise)}
                    </div>
                </div>

                <div className="bg-linear-to-r from-purple-500/20 to-pink-500/20 rounded-2xl p-4 border border-purple-400/20">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-purple-400/20 rounded-full">
                            <Sunset className="w-4 h-4 text-purple-300" />
                        </div>

                        <span className="text-white text-sm font-medium">
                            Sunset
                        </span>
                    </div>

                    <div className="text-white font-semibold text-lg pl-11">
                        {formatTime(weather.sys.sunset)}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WeatherCard;
