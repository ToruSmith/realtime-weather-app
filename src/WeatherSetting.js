import React, { useState } from "react";
import styled from "@emotion/styled";

import { availableLocations } from "./utils";

const WeatherSettingWrapper = styled.div`
  position: relative;
  min-width: 360px;
  box-shadow: ${({ theme }) => theme.boxShadow};
  background-color: ${({ theme }) => theme.foregroundColor};
  box-sizing: border-box;
  padding: 20px;
`;

const Title = styled.div`
  font-size: 28px;
  color: ${({ theme }) => theme.titleColor};
  margin-bottom: 30px;
`;

const StyledLabel = styled.label`
  display: block;
  font-size: 16px;
  color: ${({ theme }) => theme.textColor};
  margin-bottom: 15px;
`;

const StyledInputList = styled.input`
  display: block;
  box-sizing: border-box;
  background: transparent;
  border: 1px solid ${({ theme }) => theme.textColor};
  outline: none;
  width: 100%;
  max-width: 100%;
  color: ${({ theme }) => theme.textColor};
  font-size: 16px;
  padding: 7px 10px;
  margin-bottom: 40px;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  > button {
    display: flex;
    align-items: center;
    justify-content: center;
    white-space: nowrap;
    user-select: none;
    margin: 0;
    letter-spacing: 0.3px;
    line-height: 1;
    cursor: pointer;
    overflow: visible;
    text-transform: none;
    border: 1px solid transparent;
    background-color: transparent;
    height: 35px;
    width: 80px;
    border-radius: 5px;

    &:focus,
    &.focus {
      outline: 0;
      box-shadow: none;
    }

    &::-moz-focus-inner {
      padding: 0;
      border-style: none;
    }
  }
`;

const Back = styled.button`
  && {
    color: ${({ theme }) => theme.textColor};
    border-color: ${({ theme }) => theme.textColor};
  }
`;

const Save = styled.button`
  && {
    color: white;
    background-color: #40a9f3;
  }
`;

//從 availableLocations 取出 cityName 來做為讓使用者可以選擇地區的清單
const locations = availableLocations.map((location) => location.cityName);

//從 props 中取出 cityName 和 setCurrentCity
const WeatherSetting = ({ setCurrentPage, cityName, setCurrentCity }) => {
  const [locationName, setLocationName] = useState(cityName);

  // 定義 handleChange 要做的事
  const handleChange = (e) => {
    console.log(e.target.value);
    // 把使用者輸入的內容更新到 React 內的資料狀態
    setLocationName(e.target.value);
  };
  //定義 handleSave 方法  //判斷使用者填寫的地區是否包含在 locations 陣列內
  const handleSave = () => {
    if (locations.includes(locationName)) {
      // TODO: 儲存地區資訊...
      console.log(`儲存的地區資訊為：${locationName}`);

      // 按下儲存時更新 WeatherApp 內的 currentCity
      setCurrentCity(locationName);

      // 透過 setCurrentPage 導回天氣資訊頁
      setCurrentPage("WeatherCard");
    } else {
      alert(`儲存失敗：您輸入的 ${locationName} 並非有效的地區`);
      return;
    }
  };

  return (
    <WeatherSettingWrapper>
      {console.log("render")}
      <Title>設定</Title>
      <StyledLabel htmlFor="location">地區</StyledLabel>
      {/*使用 onChange 事件來監聽使用者輸入資料 */}
      <StyledInputList
        list="location-list"
        id="location"
        name="location"
        onChange={handleChange}
        value={locationName}
      />

      <datalist id="location-list">
        {/* 利用迴圈的方式跑出所有 option */}
        {locations.map((location) => (
          <option value={location} key={location} />
        ))}
      </datalist>

      <ButtonGroup>
        {/*呼叫 setCurrentPage 方法來換頁 */}
        <Back onClick={() => setCurrentPage("WeatherCard")}>返回</Back>
        <Save onClick={handleSave}>儲存</Save>
      </ButtonGroup>
    </WeatherSettingWrapper>
  );
};

export default WeatherSetting;
