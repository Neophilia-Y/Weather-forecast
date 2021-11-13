import { StatusBar } from 'expo-status-bar';
import * as Location from "expo-location";
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Dimensions } from 'react-native';

const WINDOW_WIDTH = Dimensions.get("window").width;
const WINDOW_HEIGHT = Dimensions.get("window").height;
const WEATHER_API = "c48b9bb9f8b45f2b0640a3c5f39ad98c";



export default function App() {

  const [location, setLocation] = useState("Seoul");
  const [errorMsg, setErrorMsg] = useState("null");
  const [ok, setOk] = useState(true);
  console.log("App started")

  const getWeahter = async () => {
    const { granted } = await Location.requestForegroundPermissionsAsync();

    if (!granted) {
      setOk(false);
      // Show Message "GPS access deny"
    }
    const { coords: { latitude, longitude },
    } = await Location.getCurrentPositionAsync({ accuracy: 2 });
    const city_info = await Location.reverseGeocodeAsync({ latitude, longitude })
    setLocation(city_info[0].city)
    //End get location information
    console.log(`your location is ${location}`);

    //using weather api: send request with latitude, longitude.
    const weatherInfo = await fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=minutely,hourly&units=metric&appid=${WEATHER_API}`
    ).then((response) => response.json()
    ).catch((err) => console.log(err))

    console.log(weatherInfo)

  }

  useEffect(() => {
    getWeahter();
  }, []);


  return (
    <View style={styles.container}>
      <View style={styles.cityContainer}>
        <Text style={styles.cityName}>{location}</Text>
      </View>
      <View style={styles.dateContainer}>
        <Text style={styles.day}>Monday</Text>
        <Text style={styles.date}>04 November</Text>
      </View>
      <View style={styles.tempContainer} >
        <ScrollView style={styles.scrollContainer} horizontal={true} pagingEnabled={true}>
          <View style={styles.dailyContainer}>
            <Text style={styles.degree}>27 ℃ </Text>
            <Text style={styles.weatherIcon}>Sunny</Text>
          </View>
          <View style={styles.dailyContainer}>
            <Text style={styles.degree}>27 ℃ </Text>
            <Text style={styles.weatherIcon}>Sunny</Text>
          </View>
          <View style={styles.dailyContainer}>
            <Text style={styles.degree}>27 ℃ </Text>
            <Text style={styles.weatherIcon}>Sunny</Text>
          </View>
        </ScrollView>
      </View>
      <StatusBar style="dark" />
    </View>
  );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFD503',
    paddingLeft: 30,
    paddingRight: 30,

  },
  cityContainer: {
    flex: 2,
    alignItems: 'center',
    justifyContent: "center",
  },
  cityName: {
    fontSize: 36,
    fontFamily: "Cochin",
  },
  dateContainer: {
    flex: 0.5,
  },
  day: {
    fontSize: 24,
    fontWeight: "600",
  },
  date: {
    fontSize: 24,
  },
  tempContainer: {
    flex: 3,
    marginTop: 50,
    marginBottom: 30,
    paddingTop: 50,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "transparent",
    borderWidth: 7,
  },
  degree: {
    fontSize: 100,
  },
  weatherIcon: {
    fontSize: 20,
  },
  scrollContainer: {
  },
  dailyContainer: {
    width: WINDOW_WIDTH - 60,
  }
});
