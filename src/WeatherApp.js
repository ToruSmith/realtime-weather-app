import React, { useState, useEffect, useCallback, useMemo } from "react";
import styled from "@emotion/styled";

import { ThemeProvider } from "@emotion/react";
import WeatherCard from "./WeatherCard";
import useWeatherApi from "./useWeatherApi";

import WeatherSetting from "./WeatherSetting";
import { findLocation } from "./utils";

const theme = {
  light: {
    backgroundColor: "#ededed",
    foregroundColor: "#f9f9f9",
    boxShadow: "0 1px 3px 0 #999999",
    titleColor: "#212121",
    temperatureColor: "#757575",
    textColor: "#828282",
  },
  dark: {
    backgroundColor: "#1F2022",
    foregroundColor: "#121416",
    boxShadow:
      "0 1px 4px 0 rgba(12, 12, 13, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.15)",
    titleColor: "#f9f9fa",
    temperatureColor: "#dddddd",
    textColor: "#cccccc",
  },
};

const Container = styled.div`
  background-color: ${({ theme }) => theme.backgroundColor};
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const WeatherApp = () => {
  console.log("--- invoke function component ---");
  const storageCity = localStorage.getItem("cityName");

  // 若 storageCity 存在則作為 currentCity 的預設值，否則使用 '基隆市'
  const [currentCity, setCurrentCity] = useState(storageCity || "基隆市");
  //根據 currentCity 來找出對應到不同 API 時顯示的地區名稱，找到的地區取名為 locationInfo
  const currentLocation = findLocation(currentCity) || {};
  //把 currentLocation 當成參數直接傳入 useWeatherApi 的函式內
  const [weatherElement, fetchData] = useWeatherApi(currentLocation);
  const [currentPage, setCurrentPage] = useState("WeatherCard");

  const [currentTheme, setCurrentTheme] = useState("dark");

  const moment = useMemo(() => {
    const now = new Date();
    const sunriseTimestamp = new Date(
      `${weatherElement.SunDate}T${weatherElement.SunRiseTime}:00`
    ).getTime();

    const sunsetTimestamp = new Date(
      `${weatherElement.SunDate}T${weatherElement.SunSetTime}:00`
    ).getTime();

    const nowTimeStamp = now.getTime();

    return sunriseTimestamp <= nowTimeStamp && nowTimeStamp <= sunsetTimestamp
      ? "day"
      : "night";
  }, [weatherElement.SunRiseTime, weatherElement.SunSetTime]);

  useEffect(() => {
    setCurrentTheme(moment === "day" ? "dark" : "light");
  }, [moment]);

  //當 currentCity 有改變的時候，儲存到 localStorage 中
  useEffect(() => {
    localStorage.setItem("cityName", currentCity);
  }, [currentCity]);

  return (
    <ThemeProvider theme={theme[currentTheme]}>
      <Container>
        {currentPage === "WeatherCard" && (
          <WeatherCard
            cityName={currentLocation.cityName}
            weatherElement={weatherElement}
            moment={moment}
            fetchData={fetchData}
            setCurrentPage={setCurrentPage}
          />
        )}

        {currentPage === "WeatherSetting" && (
          <WeatherSetting
            // 把縣市名稱傳入 WeatherSetting 中當作表單「地區」欄位的預設值
            cityName={currentLocation.cityName}
            // 把 setCurrentCity 傳入，讓 WeatherSetting 可以修改 currentCity
            setCurrentCity={setCurrentCity}
            setCurrentPage={setCurrentPage}
          />
        )}
      </Container>
    </ThemeProvider>
  );
};

export default WeatherApp;
