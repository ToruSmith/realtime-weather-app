import React, { useState, useEffect, useCallback } from "react";

//useWeatherApi 可以接收參數，參數名稱取名為 currentLocation
const fetchCurrentWeather = (locationName) => {
  return fetch(
    `https://opendata.cwa.gov.tw/api/v1/rest/datastore/O-A0003-001?Authorization=CWA-64412ADE-FF1D-4C54-81C4-99FECA8D1A1A&StationName=${locationName}`
  )
    .then((response) => response.json())
    .then((data) => {
      console.log(data.records.Station[0]);
      const locationData = data.records.Station[0];

      const weatherElements = {
        WindSpeed: locationData.WeatherElement.WindSpeed,
        AirTemperature: locationData.WeatherElement.AirTemperature,
        RelativeHumidity: locationData.WeatherElement.RelativeHumidity,
      };

      // STEP 3：要使用到 React 組件中的資料
      return {
        observationTime: locationData.ObsTime.DateTime,
        locationName: locationData.StationName,

        temperature: weatherElements.AirTemperature,
        windSpeed: weatherElements.WindSpeed,
        humid: weatherElements.RelativeHumidity,
      };
    });
};
const fetchWeatherForecast = (cityName) => {
  return fetch(
    `https://opendata.cwa.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=CWA-64412ADE-FF1D-4C54-81C4-99FECA8D1A1A&locationName=${cityName}`
  )
    .then((response) => response.json())
    .then((data) => {
      const locationData = data.records.location[0];
      const weatherElements = locationData.weatherElement.reduce(
        (neededElements, item) => {
          if (["Wx", "PoP", "CI"].includes(item.elementName)) {
            neededElements[item.elementName] = item.time[0].parameter;
          }
          return neededElements;
        },
        {}
      );

      return {
        description: weatherElements.Wx.parameterName,
        weatherCode: weatherElements.Wx.parameterValue,
        rainPossibility: weatherElements.PoP.parameterName,
        comfortability: weatherElements.CI.parameterName,
      };
    });
};

const now = new Date();
const nowDate = Intl.DateTimeFormat("zh-TW", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
})
  .format(now)
  .replace(/\//g, "-");

const fetchCurrentMoment = (cityName) => {
  return fetch(
    `https://opendata.cwa.gov.tw/api/v1/rest/datastore/A-B0062-001?Authorization=CWA-64412ADE-FF1D-4C54-81C4-99FECA8D1A1A&CountyName=${cityName}&Date=${nowDate}`
  )
    .then((response) => response.json())
    .then((data) => {
      const locationData = data.records.locations.location[0];
      console.log(data.records.locations.location[0]);

      const weatherElements = {
        SunDate: locationData.time[0].Date,
        SunRiseTime: locationData.time[0].SunRiseTime,
        SunSetTime: locationData.time[0].SunSetTime,
      };
      return {
        SunDate: weatherElements.SunDate,
        SunRiseTime: weatherElements.SunRiseTime,
        SunSetTime: weatherElements.SunSetTime,
      };
    });
};
//STEP 1：讓 useWeatherApi 可以接收參數
const useWeatherApi = (currentLocation) => {
  // 將傳入的 currentLocation 透過解構賦值取出 locationName 和 cityName
  const { locationName, cityName } = currentLocation;
  const [weatherElement, setweatherElement] = useState({
    observationTime: new Date(),
    locationName: "",
    humid: 0,
    temperature: 0,
    windSpeed: 0,
    description: "",
    weatherCode: 0,
    rainPossibility: 0,
    comfortability: "",
    SunRiseTime: "",
    SunSetTime: "",
    isLoading: true,
  });

  const fetchData = useCallback(() => {
    // STEP 3：把原本的 fetchData 改名為 fetchingData 放到 useCallback 的函式內
    const fetchingData = async () => {
      const [currentWeather, weatherForecast, currentMoment] =
        await Promise.all([
          // 給天氣資料拉取 API 用的地區名稱
          fetchCurrentWeather(locationName),
          fetchWeatherForecast(cityName),
          fetchCurrentMoment(cityName),
        ]);

      setweatherElement({
        ...currentWeather,
        ...weatherForecast,
        ...currentMoment,
        isLoading: false,
      });
    };

    setweatherElement((prevState) => ({
      ...prevState,
      isLoading: true,
    }));

    // STEP 4：一樣記得要呼叫 fetchingData 這個方法
    fetchingData();
    // STEP 5：因為 fetchingData 沒有相依到 React 組件中的資料狀態，所以 dependencies 帶入空陣列
  }, [locationName, cityName]);
  // 說明：一旦 locationName 或 cityName 改變時，fetchData 就會改變，此時 useEffect 內的函式就會再次執行，拉取最新的天氣資料

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return [weatherElement, fetchData];
};

export default useWeatherApi;
