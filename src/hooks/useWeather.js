import { useCallback, useEffect, useState } from "react";

import {
    getCurrentWeather,
    getCurrentWeatherByCoords,
    getWeatherForecast,
    getWeatherForecastByCoords,
} from "../services/weatherAPI";

export const useWeather = () => {
    const [currentWeather, setCurrentWeather] = useState(null);
    const [forecast, setForecast] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [unit, setUnit] = useState("C");
    const [lastSearchedCity, setLastSearchedCity] =
        useState("Chandigarh");

    // Fetch weather by city name
    const fetchWeatherByCity = useCallback(async (city) => {
        const cityName =
            typeof city === "string" ? city.trim() : "";

        if (!cityName) {
            setError("Please enter a city name.");
            return;
        }

        setLastSearchedCity(cityName);
        setLoading(true);
        setError(null);

        try {
            const [weatherData, forecastData] = await Promise.all([
                getCurrentWeather(cityName),
                getWeatherForecast(cityName),
            ]);

            setCurrentWeather(weatherData);
            setForecast(forecastData);
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Failed to fetch weather data."
            );
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchWeatherByLocation = useCallback(() => {
        if (!navigator.geolocation) {
            setError(
                "Geolocation is not supported by your browser."
            );
            return;
        }

        setLoading(true);
        setError(null);

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const { latitude, longitude } = position.coords;

                    const [weatherData, forecastData] =
                        await Promise.all([
                            getCurrentWeatherByCoords(
                                latitude,
                                longitude
                            ),
                            getWeatherForecastByCoords(
                                latitude,
                                longitude
                            ),
                        ]);

                    setCurrentWeather(weatherData);
                    setForecast(forecastData);
                    setLastSearchedCity(weatherData.name);
                } catch (error) {
                    setError(
                        error instanceof Error
                            ? error.message
                            : "Failed to fetch weather for your location."
                    );
                } finally {
                    setLoading(false);
                }
            },
            (geoError) => {
                let message;

                switch (geoError.code) {
                    case 1:
                        message =
                            "Location permission denied. Please allow location access in your browser.";
                        break;
                    case 2:
                        message =
                            "Your current location could not be determined.";
                        break;
                    case 3:
                        message =
                            "Location request timed out. Please try again.";
                        break;
                    default:
                        message =
                            "Unable to retrieve your location.";
                }

                setError(message);
                setLoading(false);
            },
            {
                enableHighAccuracy: false,
                timeout: 10000,
                maximumAge: 60000,
            }
        );
    }, []);

    const retryWeather = useCallback(() => {
        const cityToRetry =
            currentWeather?.name || lastSearchedCity;

        return fetchWeatherByCity(cityToRetry);
    }, [currentWeather, lastSearchedCity, fetchWeatherByCity]);

    const toggleUnit = useCallback((nextUnit) => {
        if (nextUnit === "C" || nextUnit === "F") {
            setUnit(nextUnit);
        }
    }, []);

    useEffect(() => {
        void fetchWeatherByCity("Chandigarh");
    }, [fetchWeatherByCity]);

    return {
        currentWeather,
        forecast,
        loading,
        error,
        unit,
        fetchWeatherByCity,
        fetchWeatherByLocation,
        retryWeather,
        toggleUnit,
    };
};