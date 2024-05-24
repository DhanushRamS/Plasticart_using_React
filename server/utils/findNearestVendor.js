const findNearestVendor = (lat, lon, vendors) => {
  const R = 6371;
  const toRad = (value) => (value * Math.PI) / 180;

  let nearestVendor = null;
  let minDistance = Infinity;

  vendors.forEach((vendor) => {
    const dLat = toRad(vendor.latitude - lat);
    const dLon = toRad(vendor.longitude - lon);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat)) *
        Math.cos(toRad(vendor.latitude)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    if (distance < minDistance && distance <= 10) {
      minDistance = distance;
      nearestVendor = vendor;
    }
  });

  return nearestVendor;
};

module.exports = findNearestVendor;
