const API_KEY = "873e8e6151267ebc81eb6e4ab5d3bf2e";
const BASE_URL = "https://api.openweathermap.org/data/2.5";
const GEO_URL = "https://api.openweathermap.org/geo/1.0";

// Reusable function for API requests and error handling
const fetchJson = async (url, city = "") => {
    let response;

    try {
        response = await fetch(url);
    } catch (error) {
        if (error instanceof TypeError) {
            throw new Error(
                "Network error. Please check your internet connection and try again."
            );
        }

        throw error;
    }

    if (!response.ok) {
        if (response.status === 401) {
            throw new Error(
                "Invalid API key. Please check your OpenWeatherMap API configuration."
            );
        }

        if (response.status === 404) {
            throw new Error(
                city
                    ? `City ${city} not found. Please check the spelling and try again.`
                    : "Requested location not found."
            );
        }

        if (response.status === 429) {
            throw new Error(
                "API request limit reached. Please try again later."
            );
        }

        if (response.status >= 500) {
            throw new Error(
                "Weather service is temporarily unavailable. Please try again later."
            );
        }

        throw new Error(`API request failed with status ${response.status}.`);
    }

    return response.json();
};

// Get current weather by city name
export const getCurrentWeather = async (city) => {
    const params = new URLSearchParams({
        q: city.trim(),
        appid: API_KEY,
        units: "metric",
    });

    const data = await fetchJson(
        `${BASE_URL}/weather?${params}`,
        city
    );

    if (!data.dt) {
        data.dt = Math.floor(Date.now() / 1000);
    }

    return data;
};

// Get current weather by coordinates
export const getCurrentWeatherByCoords = async (lat, lon) => {
    const params = new URLSearchParams({
        lat: String(lat),
        lon: String(lon),
        appid: API_KEY,
        units: "metric",
    });

    const data = await fetchJson(
        `${BASE_URL}/weather?${params}`
    );

    if (!data.dt) {
        data.dt = Math.floor(Date.now() / 1000);
    }

    return data;
};

// Get weather forecast by city name
export const getWeatherForecast = async (city) => {
    const params = new URLSearchParams({
        q: city.trim(),
        appid: API_KEY,
        units: "metric",
    });

    return await fetchJson(
        `${BASE_URL}/forecast?${params}`,
        city
    );
};

// Search for cities
export const searchCities = async (query) => {
    if (!query.trim()) {
        return [];
    }

    const params = new URLSearchParams({
        q: query.trim(),
        limit: "5",
        appid: API_KEY,
    });

    const data = await fetchJson(
        `${GEO_URL}/direct?${params}`
    );

    return data.map((city) => ({
        name: city.name,
        lat: city.lat,
        lon: city.lon,
        country: city.country,
        state: city.state || "",
    }));
};