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
