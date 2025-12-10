/**
 * Temperature Conversion Utility
 * Converts Celsius temperatures in recipe text to Fahrenheit for US users
 */

/**
 * Convert Celsius to Fahrenheit
 */
export function celsiusToFahrenheit(celsius: number): number {
  return Math.round((celsius * 9/5) + 32);
}

/**
 * Convert temperature text from Celsius to Fahrenheit
 * Handles various formats: "180C", "180°C", "180 degrees C", "180 celsius"
 */
export function convertTemperatureText(text: string): string {
  // Pattern 1: "180C" or "180°C"
  let converted = text.replace(/(\d+)\s*°?\s*C\b/gi, (_match, temp) => {
    const fahrenheit = celsiusToFahrenheit(parseInt(temp));
    return `${fahrenheit}°F`;
  });
  
  // Pattern 2: "180 degrees Celsius" or "180 degrees C"
  converted = converted.replace(/(\d+)\s*degrees?\s+(celsius|C)\b/gi, (_match, temp) => {
    const fahrenheit = celsiusToFahrenheit(parseInt(temp));
    return `${fahrenheit}°F`;
  });
  
  // Pattern 3: "celsius" or "Celsius" without number (just replace word)
  converted = converted.replace(/\bcelsius\b/gi, 'Fahrenheit');
  
  return converted;
}

/**
 * Convert common cooking temperatures from Celsius to Fahrenheit
 * Used for recipe instructions
 */
export const commonCookingTemperatures: { [key: number]: number } = {
  100: 212,  // Boiling water
  120: 250,  // Low oven
  140: 275,  // Very low oven
  150: 300,  // Slow oven
  160: 325,  // Moderately slow oven
  180: 350,  // Moderate oven (most common)
  190: 375,  // Moderately hot oven
  200: 400,  // Hot oven
  220: 425,  // Very hot oven
  230: 450,  // Very hot oven
  240: 475,  // Extremely hot oven
};

/**
 * Get Fahrenheit equivalent with descriptive text
 */
export function getTemperatureDescription(celsius: number): string {
  const fahrenheit = celsiusToFahrenheit(celsius);
  
  if (celsius === 100) return `${fahrenheit}°F (boiling)`;
  if (celsius <= 140) return `${fahrenheit}°F (low)`;
  if (celsius <= 160) return `${fahrenheit}°F (medium-low)`;
  if (celsius <= 180) return `${fahrenheit}°F (medium)`;
  if (celsius <= 200) return `${fahrenheit}°F (medium-high)`;
  return `${fahrenheit}°F (high)`;
}
