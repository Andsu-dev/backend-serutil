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

module.exports = timestampToDate;
