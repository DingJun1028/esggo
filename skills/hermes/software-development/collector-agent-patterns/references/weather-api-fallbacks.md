# Weather API Fallbacks — Session Notes

## Context

Task: "Collect weather data for Taipei" (Phase 2 Agent 6)

## API Discovery

### OpenWeatherMap (primary attempt — FAILED)
- URL: `https://api.openweathermap.org/data/2.5/weather?q=Taipei,Taiwan&units=metric&appid=test`
- Result: `{"cod":401, "message": "Invalid API key. Please see https://openweathermap.org/faq#error401 for more info."}`
- The placeholder key `test` is rejected. No real API key available.

### Open-Meteo (primary replacement — SUCCESS)
- URL: `https://api.open-meteo.com/v1/forecast?latitude=25.0320&longitude=121.5654&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&hourly=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&forecast_days=1&timezone=Asia/Taipei`
- No API key required
- Returns clean structured JSON with current weather + 24-hour hourly forecast
- WMO weather codes (0=clear, 1=mainly clear, 2=partly cloudy, 3=overcast, 51=drizzle, etc.)

### wttr.in (backup — SUCCESS)
- URL: `https://wttr.in/Taipei?format=j1`
- No API key required
- Returns rich JSON including feels-like temperature, pressure, UV index, visibility, daily summary
- Larger response (~1366 lines), slower than Open-Meteo
- Use as supplement to Open-Meteo for additional fields

## Taipei Coordinates
- Latitude: 25.0320
- Longitude: 121.5654
- Timezone: Asia/Taipei (UTC+8)

## WMO Weather Code Reference

| Code | Description |
|------|-------------|
| 0 | Clear sky |
| 1 | Mainly clear |
| 2 | Partly cloudy |
| 3 | Overcast |
| 45 | Fog |
| 48 | Depositing rime fog |
| 51 | Light drizzle |
| 53 | Moderate drizzle |
| 55 | Dense drizzle |
| 56 | Light freezing drizzle |
| 57 | Dense freezing drizzle |
| 61 | Slight rain |
| 63 | Moderate rain |
| 66 | Slight rain with thunder |
| 67 | Heavy rain with thunder |
| 71 | Slight snow fall |
| 73 | Moderate snow fall |
| 75 | Heavy snow fall |
| 77 | Snow grains |
| 80 | Slight rain showers |
| 81 | Moderate rain showers |
| 82 | Violent rain showers |
| 85 | Slight snow showers |
| 86 | Heavy snow showers |
| 95 | Thunderstorm |
| 96 | Thunderstorm with slight hail |
| 99 | Thunderstorm with heavy hail |

## Sample Data (2026-07-23)

Current weather at time of collection:
- Temperature: 29.3°C
- Humidity: 80%
- Conditions: Partly cloudy (WMO code 2)
- Wind: 9.4 km/h
- Feels like: 41°C (from wttr.in)
- Pressure: 1007 hPa
- UV Index: 0

Daily summary:
- Avg temp: 29°C, Max: 34°C, Min: 25°C
