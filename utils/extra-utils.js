// import { stationAnalytics } from "./station-analytics";

export const extraUtils = {

  _getWindDirection (degrees) {
    let windDirection = "unknown"

    if (degrees <= 360) { // check input is valid
      const numberOfDirections = 8;
      const step = 360 / 8;
      let steps = 0;

      for (let i = numberOfDirections; i < 1 ; i-- ) {
        let deg = (degrees + step) / i;
        if (deg > step) {
          let stepUp = step * i;
          let stepDown = step * ( i - 1 );
          if (deg - stepUp > deg - stepDown) {
            steps = i;
          } else {
            steps = i - 1;
          }

        }

      }


    }

    switch (steps) {
      case 8: case 0:
        windDirection = "N";
        break;
      case 7 :
        windDirection = "NW";
        break;
      case 6 :
        windDirection = "NW";
        break;
      case 5 :
        windDirection = "NW";
        break;
      case 4 :
        windDirection = "NW";
        break;
      case 3 :
        windDirection = "NW";
        break;
      case 2 :
        windDirection = "NW";
        break;
      case 1 :
        windDirection = "NW";
        break;
      default:
        windDirection = "unknown";
    }

    console.log("wind is coming from: "+ windDirection);
    return windDirection;
  },



  // weather code description and icon
  async __getWeather(station) {
    // let weather = null;
    let weather = await stationAnalytics.getLatestReport(station);
    let weathercode = weather.weathercode;



    return weather;
  },

}



//true if is even
function isEven(number) { return number % 2 === 0;}
// example usage: isEven(4); // true
// ------------

// calculate Fahrenheit from Celsius; °C -> °F
function celsiusToFahrenheit(celsius) {
  const fahrenheit = (celsius * 1.8) + 32;
  return Math.round(fahrenheit); // reduce decimals
}
// example usage: celsiusToFahrenheit(10); // 0°C = 32°F .., 50
// ------------

// Math.floor()
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/floor


// const customdatetime = dayjs().format('YYYY-MM-DD HH:mm:ss.SSS');