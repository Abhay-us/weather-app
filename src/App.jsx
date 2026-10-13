import ErrorMessage from "./components/ErrorMessage";
import LoadingSpinner from "./components/LoadingSpinner";
import SearchBar from "./components/SearchBar";
import TemperatureToggle from "./components/TemperatureToggle";
import WeatherCard from "./components/WeatherCard";
import WeatherForecast from "./components/WeatherForecast";
import { useWeather } from "./hooks/useWeather";

const App = () => {
  const {
    currentWeather,
    forecast,
    loading,
    error,
    unit,
    fetchWeatherByCity,
    fetchWeatherByLocation,
    toggleUnit,
  } = useWeather();

  const handleRetry = () => {
    if (currentWeather) {
      fetchWeatherByCity(currentWeather.name);
    } else {
      fetchWeatherByCity("");
    }
  }

  return (
    <>
      <div className="min-h-screen relative overflow-hidden">

        {/* Background image with Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.pexels.com/photos/1431822/pexels-photo-1431822.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop')`,
          }}
        >
          <div className="absolute inset-0 bg-linear-to-br from-blue-900/40 via-purple-900/30 to-indigo-900/40">
          </div>

          <div className="absolute inset-0 bg-black/20"></div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 container mx-auto px-4 py-8 min-h-screen">

          <div className="max-w-7xl mx-auto">

            {/* Header Section */}
            <div className="text-center mb-12">

              <div className="mb-8">

                <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 drop-shadow-2xl tracking-tight">
                  Weather

                  <span className="bg-linear-to-r ml-2 from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    Pro
                  </span>
                </h1>

                <p className="text-white/80 text-lg md:text-xl mb-8 max-w-2xl mx-auto leading-relaxed">
                  Experience weather like never before with real-time data,
                  beautiful visuals, and precise forecasts for any location
                  worldwide.
                </p>

              </div>

              <div className="flex flex-col lg:flex-row items-center justify-center space-y-6 lg:space-y-0 lg:space-x-6 mb-12">
                <SearchBar
                  onsearch={fetchWeatherByCity}
                  onLocationSearch={fetchWeatherByLocation}
                  loading={loading}
                />
                <TemperatureToggle unit={unit} onToggle={toggleUnit} />
              </div>
            </div>

            {/* main content  */}
            <div className="space-y-8">
              {loading && (
                <div className="flex justify-center">
                  <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20">
                    <LoadingSpinner />
                    <p className="text-white/80 text-center mt-4 font-medium">Fetching latest weather data..........</p>
                  </div>
                </div>
              )}

              {error && !loading && (
                <div className="max-w-2xl mx-auto">
                  <ErrorMessage message={error} onRetry={handleRetry} />
                </div>
              )}

              {currentWeather && !loading && (
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                  <div className="xl:col-span-2">
                    <WeatherCard weather={currentWeather} unit={unit} />
                  </div>
                  <div className="xl:xol-span-1">
                    {forecast && <WeatherForecast forecast={forecast} unit={unit} />}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div >
    </>
  );
};

export default App;
