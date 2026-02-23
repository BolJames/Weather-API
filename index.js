// Import required packages
import express from "express"; // Express framework for server
import axios from "axios"; // Axios to make HTTP requests

// Create express app
const app = express();

// Define port number
const port = 3000;

// Middleware to serve static files (CSS)
app.use(express.static("public"));

// Middleware to read form data
app.use(express.urlencoded({ extended: true }));

// Set EJS as templating engine
app.set("view engine", "ejs");

/*
=========================================
HOME ROUTE
=========================================
This renders the homepage with the form
*/
app.get("/", (req, res) => {
  res.render("index");
});

/*
=========================================
WEATHER ROUTE
=========================================
1. Get city name from form
2. Convert city → latitude & longitude
3. Fetch weather using coordinates
*/
app.post("/weather", async (req, res) => {
  try {
    // Get city entered by user
    const city = req.body.city;

    /*
    STEP 1:
    Convert city name into latitude & longitude
    Using Open-Meteo Geocoding API
    */
    const geoResponse = await axios.get(
      `https://geocoding-api.open-meteo.com/v1/search?name=${city}`,
    );

    // Extract latitude & longitude from response
    const latitude = geoResponse.data.results[0].latitude;
    const longitude = geoResponse.data.results[0].longitude;

    /*
    STEP 2:
    Fetch weather data using latitude & longitude
    */
    const weatherResponse = await axios.get(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`,
    );

    // Extract current weather data
    const weather = weatherResponse.data.current_weather;

    /*
    Send data to result.ejs
    */
    res.render("results", {
      city: city,
      temperature: weather.temperature,
      windspeed: weather.windspeed,
      weathercode: weather.weathercode,
    });
  } catch (error) {
    // If something fails, log error
    console.error(error.message);

    // Show user-friendly error
    res.send("Error fetching weather data. Please try again.");
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
