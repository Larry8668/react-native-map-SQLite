import React from "react";
import MapScreen from "./components/MapScreen";
import FilterOptions from "./components/FilterOptions";

import { MapContextProvider } from "./MapContext";

const App = () => {
  return (
    <MapContextProvider>
      <MapScreen />
      <FilterOptions />
    </MapContextProvider>
  );
};

export default App;
