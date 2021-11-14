import { StatusBar } from 'expo-status-bar';
import * as Location from "expo-location";
import { Fontisto } from "@expo/vector-icons";
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Dimensions, ActivityIndicator } from 'react-native';

const WINDOW_WIDTH = Dimensions.get("window").width;
const WINDOW_HEIGHT = Dimensions.get("window").height;
const SCROLLVIEW_PADDING = WINDOW_WIDTH - 60;
const WEATHER_API = "c48b9bb9f8b45f2b0640a3c5f39ad98c";



export default function App() {

  const [location, setLocation] = useState("Seoul");
  const [errorMsg, setErrorMsg] = useState("null");
  const [ok, setOk] = useState(true);
  const [index, setIndex] = useState(0);
  const [weatherData, setWeatherData] = useState([]);

  //Icon hash map
  const icons = {
    Clouds: "cloudy",
    Clear: "day-sunny",
    Atmosphere: "cloudy-gusts",
    Snow: "snow",
    Rain: "rains",
    Drizzle: "rain",
    Thunderstorm: "lightning",
  };

  // Calculate date
  const getDate = () => {
    if (weatherData.length === 0) {
      return { 0: "Have a good Day", 1: ":)" }
    }
    const date = new Date(weatherData[index].dt * 1000);
    const convertDay = date.toDateString().split(" ");
    const day = {
      0: convertDay[0],
      1: convertDay[1] + "  " + convertDay[2],
    }
    return day
  }

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

    setWeatherData(weatherInfo.daily);
  }
  // Calculate scroll container index.
  const handleScroll = (event) => {
    let scrollIndex;
    if (event.nativeEvent.contentOffset.x <= 0) {
      scrollIndex = 0;
    } else {
      scrollIndex = Math.floor((event.nativeEvent.contentOffset.x + WINDOW_WIDTH / 2) / WINDOW_WIDTH);
    }

    if (scrollIndex !== index) {
      setIndex(scrollIndex)
    }

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
        <Text style={styles.day}>{getDate()[0]}</Text>
        <Text style={styles.date}>{getDate()[1]}</Text>
      </View>
      <View style={styles.tempContainer} >
        <ScrollView style={styles.scrollContainer} horizontal={true} pagingEnabled={true} onScroll={(e) => handleScroll(e)} scrollEventThrottle={5} >
          {weatherData.length === 0 ? (
            <View style={{ ...styles.dailyContainer, alignItems: "center" }}>
              <ActivityIndicator color="black" size="large" />
            </View>) : (
            weatherData.map((weather, i) =>
              <View style={styles.dailyContainer} key={i}>
                <Text style={styles.degree}>{parseFloat(weather.temp.day).toFixed(1)} ℃ </Text>
                <Fontisto
                  name={icons[weather.weather[0].main]}
                  size={68}
                  color="black"
                />
                <Text style={styles.weatherDescription}>{weather.weather[0].description}</Text>
              </View>)

          )
          }


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
    paddingLeft: 30,
    paddingRight: 30,
  },
  day: {
    fontSize: 30,
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
    fontSize: 90,
  },
  weatherDescription: {
    fontSize: 30,
    marginTop: 30,
    fontFamily: "Cochin",
  },
  scrollContainer: {
    width: WINDOW_WIDTH,
    paddingLeft: 30,
    paddingRight: 30,

  },
  dailyContainer: {
    width: WINDOW_WIDTH,

  }
});
