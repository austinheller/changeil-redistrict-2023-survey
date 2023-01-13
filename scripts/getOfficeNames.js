// Get office names
export default function getOfficeNames(entries) {
  const offices = [];
  entries.forEach((entry) => {
    let office = entry["Ward or Office Sought"].trim();
    if (!offices.includes(office)) {
      offices.push(office);
    }
  });
  // Sort offices
  offices.sort((a, b) => {
    // Mayor: Sort to top
    if (a.includes("Mayor")) {
      return -1;
    }
    // Ward numbers: Sort lowest to highest
    const wardAMatch = a.match(/\d+/g);
    const wardBMatch = b.match(/\d+/g);
    if (wardAMatch && wardBMatch) {
      let wardAVal = a.replace(/[^0-9]/g, "");
      wardAVal = parseInt(wardAVal);
      let wardBVal = b.replace(/[^0-9]/g, "");
      wardBVal = parseInt(wardBVal);
      if (wardAVal < wardBVal) {
        return -1;
      }
    } else {
      return 1;
    }
  });
  return offices;
}
