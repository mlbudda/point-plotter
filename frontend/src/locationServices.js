// Check for HTML5 Geolocation API support and fetch user location
export async function getUserLocation() {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      }, reject);
    } else {
      reject(new Error("Geolocation is not supported."));
    }
  });
}

// IP-based fallback method
export async function getIPLocation() {
  try {
    const response = await fetch(
      "https://api.ipgeolocation.io/ipgeo?apiKey=e15655717da34dd19f54cf0dd3f3960d"
    );
    const data = await response.json();
    return {
      lat: data.latitude,
      lng: data.longitude,
    };
  } catch (error) {
    console.error("Error fetching IP location:", error);
    return {
      lat: 51.505,
      lng: -0.09,
    }; // Default coordinates
  }
}
