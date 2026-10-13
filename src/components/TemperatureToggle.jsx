const TemperatureToggle = ({ unit, onToggle }) => {
    return (
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-1 shadow-lg">
            <div className="flex items-center gap-3">
                <button
                    type="button"
                    aria-pressed={unit === "C"}
                    onClick={() => onToggle("C")}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${unit === "C"
                            ? "bg-white text-blue-600 shadow-lg scale-105"
                            : "text-white/70 hover:text-white hover:bg-white/10"
                        }`}
                >
                    °C
                </button>

                <button
                    type="button"
                    aria-pressed={unit === "F"}
                    onClick={() => onToggle("F")}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${unit === "F"
                            ? "bg-white text-blue-600 shadow-lg scale-105"
                            : "text-white/70 hover:text-white hover:bg-white/10"
                        }`}
                >
                    °F
                </button>
            </div>
        </div>
    );
};

export default TemperatureToggle;