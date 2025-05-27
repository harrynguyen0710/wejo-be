// Helper function to calculate the distance between two points using the Haversine formula
function calculateDistance(gameLocation, inputLocation) {
    const [gameLongitude, gameLatitude] = gameLocation.split(' '); // Assuming input format is "longitude latitude"
    const [inputLongitude, inputLatitude] = inputLocation.split(' ');
  
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = deg2rad(inputLatitude - gameLatitude);  // Convert latitude difference to radians
    const dLon = deg2rad(inputLongitude - gameLongitude); // Convert longitude difference to radians
  
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(deg2rad(gameLatitude)) * Math.cos(deg2rad(inputLatitude)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in kilometers
  
    return distance;
  }
  
  // Helper function to convert degrees to radians
  function deg2rad(deg) {
    return deg * (Math.PI / 180);
  }
  
  module.exports = { calculateDistance };
  