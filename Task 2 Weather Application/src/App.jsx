import React, { useEffect, useState } from "react";
import Temperature from "./components/Temperature";
import AirPoll from "./components/AirPoll";
import Daysforecast from "./components/Daysforecast";
import Sunset from "./components/Sunset";
import axios from "axios";
import Windcompass from "./components/Windcompass";

import Feelslike from "./components/Feelslike";
import Humidity from "./components/Humidity";
import Visibility from "./components/Visibility";
import Pressure from "./components/Pressure";
import Hourlyforcast from "./components/Hourlyforcast";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import Dropdownn from "./components/Dropdownn";
import { CodeXml, Github, Heart } from "lucide-react";
import Precipitation from "./components/Precipitation";
import { RiGithubFill, RiLinkedinBoxFill } from "@remixicon/react";
import { GitHubLogoIcon } from "@radix-ui/react-icons";

const App = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [city, setCity] = useState("karachi"); // State for the city to search
  const [inputCity, setInputCity] = useState(""); // State for the input field
  const [searchedCity, setSearchedCity] = useState("");
  const [temp, setTemp] = useState(null);
  const [temphi, setTemphi] = useState(null);
  const [templw, setTemplw] = useState(null);
  const [description, setDescription] = useState(null);
  const [sunset, setSunset] = useState(null);
  const [sunrise, setSunrise] = useState(null);
  const [speed, setSpeed] = useState(null);
  const [direction, setDirection] = useState(null);
  const [uvIndex, setUvIndex] = useState(null);
  const [feels, setFeels] = useState(null);
  const [humidity, setHumidity] = useState(null);
  const [visibility, setVisibility] = useState(null);
  const [pressure, setPressure] = useState(null);
  const [hourlyforcast, setHourlyforcast] = useState([]);
  const [fiveDayForecast, setFiveDayForecast] = useState([]);
  const [lat, setLat] = useState(null);
  const [lon, setLon] = useState(null);
  const [airpoll, setAirpoll] = useState(null);
  const [error, setError] = useState("");
  const [activeLayer, setActiveLayer] = useState("clouds"); // State for selected layer
  const [precipitation, setPrecipitation] = useState(null);
  const [timezone, setTimezone] = useState(null);

  const fetchWeatherData = async () => {
    if (!city.trim()) {
      return;
    }

    setError(""); // Clear previous errors
    const api_key = import.meta.env.VITE_WEATHER_API_KEY;

    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${api_key}&units=metric`
      );

      setWeatherData(response.data);
      setSearchedCity(city);
      console.log(response.data);
      setTemp(Math.round(response.data.main.temp));
      setTemphi(Math.round(response.data.main.temp_max));
      setTemplw(Math.round(response.data.main.temp_min));
      setDescription(response.data.weather[0].main);
      setSunset(response.data.sys.sunset);
      setSunrise(response.data.sys.sunrise);
      setSpeed(response.data.wind.speed);
      setDirection(response.data.wind.deg);
      setFeels(response.data.main.feels_like);
      setHumidity(response.data.main.humidity);
      setPressure(response.data.main.pressure);
      setVisibility(response.data.visibility / 1000);
      setTimezone(response.data.timezone);

      const { lat, lon } = response.data.coord;
      setLat(lat);
      setLon(lon);

      // Fetch air pollution data
      const airPollResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${api_key}`
      );
      setAirpoll(airPollResponse.data.list[0].main.aqi);

      const precipitation =
        response.data?.rain?.["1h"] || response.data?.snow?.["1h"] || 0;
      setPrecipitation(precipitation);
      console.log(precipitation);

      // Fetch UV index data
      const uvResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${api_key}`
      );
      setUvIndex(uvResponse.data.value);

      // Fetch hourly forecast data
      const hourlyResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${api_key}&units=metric`
      );
      setHourlyforcast(hourlyResponse.data.list);

      // Fetch 5-day forecast data
      const forecastResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${api_key}&units=metric`
      );
      const groupedForecast = groupForecastByDay(forecastResponse.data.list);
      setFiveDayForecast(groupedForecast);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("City not found or API error. Please try again.");
    }
    setInputCity(""); // Clear input field after search
  };

  const groupForecastByDay = (forecastList) => {
    const days = {};
    forecastList.forEach((item) => {
      const date = new Date(item.dt_txt).toLocaleDateString();
      if (!days[date]) {
        days[date] = [];
      }
      days[date].push(item);
    });

    return Object.entries(days).map(([date, data]) => ({
      date,
      data,
    }));
  };

  useEffect(() => {
    fetchWeatherData();
  }, [city]); // Fetch weather data when city changes

  const handleSearch = () => {
    setCity(inputCity); // Set the city state to trigger the useEffect
  };

  const layers = {
    clouds:
      "https://tile.openweathermap.org/map/clouds/{z}/{x}/{y}.png?appid=ed2a990f001915cca04df710a8dba3ff",
    temperature:
      "https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=ed2a990f001915cca04df710a8dba3ff",
    wind: "https://tile.openweathermap.org/map/wind/{z}/{x}/{y}.png?appid=ed2a990f001915cca04df710a8dba3ff",
  };
  return (
    <div className="px-2">
  {/* Navbar */}
  <div className="flex items-center justify-end mb-6 border-b-[1px] fixed top-0 left-0 right-0 border-[#F4F4F5] dark:border-[#262626] bg-transparent bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10 px-4 sm:px-6 py-2 sm:py-3 z-50">
    <input
      className="dark:text-[#A3A3A3] mr-2 bg-transparent bg-[#F4F4F5] dark:border-[#262626] border px-2 sm:px-3 py-1 focus:outline-none rounded-md w-40 sm:w-48 xl:w-64 lg:w-72"
      type="text"
      value={inputCity}
      onChange={(e) => setInputCity(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          handleSearch();
        }
      }}
      placeholder="Search city..."
    />
    <button
      className="bg-blue-700 text-white px-2 sm:px-3 py-1 text-sm sm:text-base dark:bg-[#27272A] rounded-md shadow-xl hover:bg-blue-800"
      onClick={handleSearch}
    >
      Search
    </button>
    <Dropdownn className="ml-2 sm:ml-3" />

  </div>

  {/* Main Layout */}
<div className="flex flex-col md:flex-row lg:w-full xl:flex-row gap-1 mt-20 items-center justify-center text-center">
  {/* Left Column - Temperature and Forecast */}
  <div className="flex flex-col w-full xl:w-[400px] ml-8 items-center justify-center">
    <Temperature
      city={searchedCity}
      temp={temp}
      temphi={temphi}
      templw={templw}
      description={description}
      timezone={timezone}
    />

    {/* Sunset, Wind (Mobile Only) */}
    <div className="grid grid-cols-2 gap-1 xl:hidden w-full justify-center">
      <Sunset sunset={sunset} sunrise={sunrise} />
      <Windcompass speed={speed} direction={direction} />
    </div>
  </div>

  {/* Right Column - Weather Metrics */}
  <div className="flex flex-col xl:flex-row flex-wrap w-full items-center justify-center space-y-1">
    {/* Top Row: Air Quality, Wind, Sunset */}
    <div className="w-full md:w-full xl:w-[1000px] flex gap-1 flex-row justify-center items-center">
      <AirPoll airpoll={airpoll} />
      <Windcompass speed={speed} direction={direction} />
      <Sunset sunset={sunset} sunrise={sunrise} />
    </div>

    {/* Bottom Row: Hourly Forecast, Feels Like, Humidity */}
    <div className="w-full md:w-full xl:w-[1000px] flex gap-1 flex-row justify-center items-center">
      <Hourlyforcast hourlyforcast={hourlyforcast} />
      <Feelslike feels={Math.round(feels)} temp={temp} />
      <Humidity humidity={humidity} />
    </div>
  </div>
</div>


  
  {/* Error Message */}
  {error && (
    <div className="text-red-500 mt-4">
      <strong>Error:</strong> {error}
    </div>
  )}
</div>

  );
};

export default App;
