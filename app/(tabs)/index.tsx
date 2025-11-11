import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  ActivityIndicator,
  SafeAreaView,
  Keyboard,
  Platform, // Import Platform
} from 'react-native';

// --- !!! IMPORTANT !!! ---
// 1. Go to https://openweathermap.org/ and create a free account.
const API_KEY = 'YOUR_KEY_HERE';

const API_URL = 'https://api.openweathermap.org/data/2.5/weather';


type WeatherData = {
  name: string;
  main: {
    temp: number;
  };
  weather: {
    description: string;
  }[]; 
};

export default function TabOneScreen() { 
  

  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [city, setCity] = useState<string>('London');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  

  const fetchWeather = async (cityName: string) => {
    if (!cityName) return;

    setLoading(true);
    setWeatherData(null);
    setError(null);
    Keyboard.dismiss(); 

    try {
      const url = `${API_URL}?q=${cityName}&appid=${API_KEY}&units=metric`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('City not found. Please try again.');
      }

      const data = (await response.json()) as WeatherData;
      setWeatherData(data);

    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  
  
  useEffect(() => {
    fetchWeather(city);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  

  return (
    // SafeAreaView handles the phone's notch/status bar area
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        
        <Text style={styles.title}>Simple Weather App</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Enter city name"
          value={city}
          onChangeText={setCity}
        />
        
        <Button 
          title="Get Weather" 
          onPress={() => fetchWeather(city)}
        />

        {/* --- Conditional Rendering --- */}

        {loading && (
          <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
        )}

        {error && (
          <Text style={styles.errorText}>{error}</Text>
        )}

        {weatherData && (
          <View style={styles.weatherInfo}>
            <Text style={styles.cityName}>{weatherData.name}</Text>
            <Text style={styles.temp}>{Math.round(weatherData.main.temp)}°C</Text>
            <Text style={styles.description}>{weatherData.weather[0]?.description}</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}


// --- 6. Styling ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f8',
  },
  content: {
    padding: 20,
    // Add a top margin to avoid the status bar, especially on Android
    marginTop: Platform.OS === 'android' ? 30 : 0, 
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: '#fff',
    marginBottom: 15,
  },
  loader: {
    marginTop: 30,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  weatherInfo: {
    alignItems: 'center',
    marginTop: 30,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  cityName: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  temp: {
    fontSize: 48,
    fontWeight: '300',
    marginVertical: 10,
  },
  description: {
    fontSize: 20,
    textTransform: 'capitalize',
    color: '#555',
  },
});
