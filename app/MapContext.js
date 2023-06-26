import React, { useState, useEffect, useContext, createContext } from "react";

export const MapContext = createContext();

export const MapContextProvider = ({ children }) => {
  const [selectedFilter, setSelectedFilter] = useState("option1");

  const handle1 = () => {
    setSelectedFilter("option1");
  };
  const handle2 = () => {
    setSelectedFilter("option2");
  };

  const handle3 = () => {
    setSelectedFilter("option3");
  };

  const values = {
    selectedFilter,
    handle1,
    handle2,
    handle3,
  };

  return <MapContext.Provider value={values}>{children}</MapContext.Provider>;
};
