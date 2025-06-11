const timestampToDate = (obj) => {
  if (!obj) return null;

  const timestampFields = ["start_date", "due_date"];

  return Object.entries(obj).reduce((acc, [key, value]) => {
    if (timestampFields.includes(key) && value) {
      try {
        acc[key] = new Date(Number(value));
      } catch (error) {
        console.error(`Error converting timestamp for field ${key}:`, error);
        acc[key] = value;
      }
    } else {
      acc[key] = value;
    }
    return acc;
  }, {});
};

const convertDateToTimestamp = (dateInput) => {
  if (typeof dateInput === "number") {
    return dateInput;
  }
  const date = new Date(dateInput);

  if (isNaN(date.getTime())) {
    throw new BadRequestError(`Invalid date format: ${dateInput}`);
  }

  return date.getTime();
};

const convertTimestampToISO = (timestamp) => {
  if (!timestamp) return null;
  try {
    return new Date(Number(timestamp)).toISOString();
  } catch (error) {
    console.error("Error converting timestamp to ISO:", error);
    return timestamp;
  }
};

module.exports = {
  timestampToDate,
  convertDateToTimestamp,
  convertTimestampToISO,
};
