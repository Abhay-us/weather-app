
import { MapPinIcon, Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { searchCities } from "../services/weatherAPI";

const SearchBar = ({ onsearch, onLocationSearch, loading }) => {
    const [query, setQuery] = useState("");
    const [suggestion, setSuggestion] = useState([]);
    const [showSuggestion, setShowSuggestion] = useState(false);
    const [searchLoading, setSearchLoading] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);

    const searchRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                searchRef.current &&
                !searchRef.current.contains(event.target)
            ) {
                setShowSuggestion(false);
                setActiveIndex(-1);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );
        };
    }, []);

    useEffect(() => {
        const trimmedQuery = query.trim();

        if (trimmedQuery.length <= 2) {
            setSuggestion([]);
            setShowSuggestion(false);
            setSearchLoading(false);
            setActiveIndex(-1);
            return;
        }

        let isCurrent = true;

        setSearchLoading(true);
        setShowSuggestion(true);
        setSuggestion([]);
        setActiveIndex(-1);

        const timeoutId = setTimeout(async () => {
            try {
                const result = await searchCities(trimmedQuery);

                if (!isCurrent) return;

                setSuggestion(result);
                setShowSuggestion(result.length > 0);
            } catch (error) {
                if (!isCurrent) return;

                console.error("Search failed:", error);
                setSuggestion([]);
                setShowSuggestion(false);
            } finally {
                if (isCurrent) {
                    setSearchLoading(false);
                }
            }
        }, 300);

        return () => {
            isCurrent = false;
            clearTimeout(timeoutId);
        };
    }, [query]);

    const handleSubmit = (event) => {
        event.preventDefault();

        if (
            showSuggestion &&
            activeIndex >= 0 &&
            suggestion[activeIndex]
        ) {
            handleSuggestionClick(suggestion[activeIndex]);
            return;
        }

        const cityName = query.trim();

        if (!cityName) return;

        onsearch(cityName);
        setQuery("");
        setSuggestion([]);
        setShowSuggestion(false);
        setActiveIndex(-1);
    };

    const handleSuggestionClick = (city) => {
        const cityName = [
            city.name,
            city.state,
            city.country,
        ]
            .filter(Boolean)
            .join(", ");

        onsearch(cityName);
        setQuery("");
        setSuggestion([]);
        setShowSuggestion(false);
        setActiveIndex(-1);
    };

    const clearSearch = () => {
        setQuery("");
        setSuggestion([]);
        setShowSuggestion(false);
        setActiveIndex(-1);
    };

    const handleKeyDown = (event) => {
        switch (event.key) {
            case "ArrowDown":
                if (suggestion.length === 0) return;

                event.preventDefault();
                setShowSuggestion(true);

                setActiveIndex((previousIndex) =>
                    previousIndex >= suggestion.length - 1
                        ? 0
                        : previousIndex + 1
                );
                break;

            case "ArrowUp":
                if (suggestion.length === 0) return;

                event.preventDefault();
                setShowSuggestion(true);

                setActiveIndex((previousIndex) =>
                    previousIndex <= 0
                        ? suggestion.length - 1
                        : previousIndex - 1
                );
                break;

            case "Enter":

                if (
                    showSuggestion &&
                    activeIndex >= 0 &&
                    suggestion[activeIndex]
                ) {
                    event.preventDefault();
                    handleSuggestionClick(
                        suggestion[activeIndex]
                    );
                }
                break;

            case "Escape":
                if (showSuggestion) {
                    event.preventDefault();
                    setShowSuggestion(false);
                    setActiveIndex(-1);
                }
                break;

            default:
                break;
        }
    };

    return (
        <div
            className="relative w-full max-w-2xl"
            ref={searchRef}
        >
            <form
                className="relative"
                onSubmit={handleSubmit}
            >
                <Search
                    aria-hidden="true"
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60 w-5 h-5"
                />

                <input
                    type="text"
                    role="combobox"
                    aria-label="Search for a city"
                    aria-autocomplete="list"
                    aria-expanded={
                        showSuggestion && suggestion.length > 0
                    }
                    aria-controls="city-suggestions"
                    aria-activedescendant={
                        activeIndex >= 0
                            ? `city-suggestion-${activeIndex}`
                            : undefined
                    }
                    autoComplete="off"
                    value={query}
                    onChange={(event) => {
                        setQuery(event.target.value);
                        setActiveIndex(-1);
                    }}
                    onKeyDown={handleKeyDown}
                    placeholder="Search for a city worldwide..."
                    disabled={loading}
                    className="w-full pl-12 pr-24 py-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 transition-all duration-300 hover:bg-white/15"
                />

                {query && (
                    <button
                        type="button"
                        aria-label="Clear search"
                        onClick={clearSearch}
                        disabled={loading}
                        className="absolute right-14 top-1/2 -translate-y-1/2 text-white/50 hover:text-white p-1 rounded-full hover:bg-white/10"
                    >
                        <X className="w-4 h-4" />
                    </button>
                )}

                <button
                    type="button"
                    aria-label="Use my current location"
                    onClick={onLocationSearch}
                    disabled={loading}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white p-2 rounded-full hover:bg-white/10"
                >
                    <MapPinIcon className="w-4 h-4" />
                </button>
            </form>

            {showSuggestion && (
                <div
                    id="city-suggestions"
                    role="listbox"
                    aria-label="City suggestions"
                    className="absolute top-full left-0 right-0 mt-3 bg-slate-900/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden z-50"
                >
                    {searchLoading ? (
                        <div
                            className="p-6 text-center text-white/70"
                            role="status"
                        >
                            <div className="animate-spin rounded-full h-6 w-6 border-2 border-white/30 border-t-white mx-auto" />
                            <p className="mt-2">
                                Searching cities...
                            </p>
                        </div>
                    ) : (
                        suggestion.map((city, index) => (
                            <button
                                key={`${city.name}-${city.state}-${city.country}-${index}`}
                                id={`city-suggestion-${index}`}
                                type="button"
                                role="option"
                                aria-selected={activeIndex === index}
                                onMouseEnter={() =>
                                    setActiveIndex(index)
                                }
                                onClick={() =>
                                    handleSuggestionClick(city)
                                }
                                className={`w-full px-6 py-4 text-left transition-all duration-200 flex items-center justify-between group border-b border-white/10 last:border-b-0 ${activeIndex === index
                                    ? "bg-white/20"
                                    : "hover:bg-white/10"
                                    }`}
                            >
                                <div>
                                    <div className="font-medium text-white">
                                        {city.name}
                                        {city.state && (
                                            <span className="text-white/70">
                                                , {city.state}
                                            </span>
                                        )}
                                    </div>

                                    <div className="text-sm text-white/60">
                                        {city.country}
                                    </div>
                                </div>

                                <Search className="w-4 h-4 text-white/40 group-hover:text-white/70" />
                            </button>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default SearchBar;
