import React, { useContext, useEffect, useState } from "react";
import { StatusBar, View, Text } from "react-native";

import MapView, { Marker, PROVIDER_OSMDROID } from "react-native-maps";

import { getDistanceFromLatLonInKm } from "../HelperFunc";

import { MapContext } from "../MapContext";

import {
  createTable,
  insertIntoTable,
  dropTable,
  displayTable,
} from "../DataService";

import axios from "axios";

//OSM (Open Street Map) is open source and hence no API key required and also no need for cred sign up
//Google maps and MapBox need cred for signup

const MapScreen = () => {
  const [mapMarkers, setMapMarkers] = useState([]);
  const { selectedFilter } = useContext(MapContext);

  const searchRadius = 5; //the filter radius
  const searchGrp = 2; //the filter grp

  const initCoord = {
    //set to pesu
    latitude: 12.9354,
    longitude: 77.5358,
  };
  const deltaCoord = {
    //the prefered pan of the map
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  //this func will get data from API, push it to the DB and then recursively call the parent func (u'll see later)
  const getApiData = async () => {
    //async as was getting empty result idk y {remove if needed}
    console.log("----API called----");
    await axios
      .get("https://yucca-interface.vercel.app/mapcoordinates")
      .then((res) => {
        // console.log(res.data.locations);
        handleApiDataInsert(res.data.locations);
        fetchAndDisplayData();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  //this is the parent func, which will take care of bringing stuff from DB
  //and checking if DB is empty => populate with API data or else simple return data
  const fetchAndDisplayData = async () => {
    try {
      const data = await displayTable();

      if (data.length === 0) {
        console.log("Table is empty => Calling API and saving");
        getApiData();
      } else {
        console.log("DbData:", data);
        setMapMarkers(data);
        //data format [{id : (num), lat: (REAL), long: (REAL), title: (TEXT), grp_id: (INTEGER)}]
        //REAL is datatype in SQLite and it is analogus to 'float'
      }
    } catch (error) {
      console.error("Error displaying table:", error);
    }
  };

  //this func was created to test out if stuff was actually working
  //just uncomment this from useEffect and comment the fetchAndDisplayTable the func and run it if u wanna reset the table
  //then just do vice versa and the code runs as if it i running on new device
  const handleDropTable = async () => {
    try {
      await dropTable();
      console.log("Table dropped successfully");
      // Perform any additional actions after dropping the table
    } catch (error) {
      console.error("Error dropping table:", error);
    }
  };

  //this function takes care of inserting (after creating table) the API data into the table
  //format of table was mentioned b4 and is also mentioned in DataService file
  const handleApiDataInsert = (item) => {
    if (item.length > 0) {
      createTable()
        .then(() => {
          item.forEach((marker) => {
            const lat = marker?.coordinates?.latitude;
            const long = marker?.coordinates?.longitude;
            insertIntoTable(marker.id, lat, long, marker.name, marker.groupCode)
              .then(() =>
                console.log(
                  "Marker saved to database-->",
                  marker.id,
                  lat,
                  long,
                  marker.name,
                  marker.groupCode
                )
              )
              .catch((error) =>
                console.error("Error saving marker to database-->", error)
              );
          });
        })
        .catch((error) => console.error("Error creating table-->", error));
    }
  };

  //this contains the filtered list after applying the filter func
  //based on the pre defined search radii and search grp (mentioned in the begining)
  const filteredMarkers = mapMarkers.filter((marker) => {
    switch (selectedFilter) {
      case "option1": {
        return true;
      }
      case "option2": {
        const tempDist = getDistanceFromLatLonInKm(
          marker.latitude,
          marker.longitude,
          initCoord.latitude,
          initCoord.longitude
        );
        // console.log(tempDist);
        return tempDist <= searchRadius;
      }
      case "option3": {
        return marker.grp_id === searchGrp;
      }
    }
  });

  //driver of entire screen
  //does wat was mentioned in comment b4 handleDropTable func
  useEffect(() => {
    fetchAndDisplayData();
    // handleDropTable();
  }, []);

  //when the data is being saved and called from DB small delay with an aesthetic loading screen 🤌
  if (filteredMarkers.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  //rendering stuff
  return (
    <View style={{ flex: 1, marginTop: StatusBar.currentHeight }}>
      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: initCoord.latitude,
          longitude: initCoord.longitude,
          latitudeDelta: deltaCoord.latitudeDelta,
          longitudeDelta: deltaCoord.longitudeDelta,
        }}
      >
        {filteredMarkers.length > 0 &&
          filteredMarkers.map((marker) => (
            <Marker
              // id="${Date.now}" //each marker needs a unique key => current time

              id={marker.id} //implemented id when api is called => no need for ^
              //nvm duplicate key warning still there ignore plz <----------------------------

              coordinate={{
                latitude: marker?.latitude,
                longitude: marker?.longitude,
              }}
              title={marker.title}
              description="Hello" //small grey text below the title if needed
            />
          ))}
      </MapView>
      {/* <Text>{selectedFilter}</Text> */}
    </View>
  );
};

export default MapScreen;
