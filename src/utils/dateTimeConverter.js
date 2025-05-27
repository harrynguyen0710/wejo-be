const getDateTimeObject = (currentDate, currentTime) => {
  console.log('currentDate::', currentDate); // e.g., 2025-04-24
  console.log('currentTime::', currentTime); // e.g., 00:00:00

  // Create the date object by combining currentDate and currentTime, assuming they're in local time.
  const dateTimeString = `${currentDate}T${currentTime}`;

  // Parse the date without any timezone conversion
  const dateTimeObject = new Date(dateTimeString + 'Z'); // Append 'Z' to force UTC interpretation
  console.log('ISO String:', dateTimeObject.toISOString()); // Will print the ISO string in UTC

  // Ensure the date is interpreted as the exact date you entered (without shifting).
  const localDateTimeObject = new Date(dateTimeObject.getTime() - dateTimeObject.getTimezoneOffset() * 60000);

  console.log('Local DateTime:', localDateTimeObject.toISOString());

  // Return the local date object in your time zone (this avoids any time zone shifts)
  return localDateTimeObject;
};

module.exports = {
  getDateTimeObject,
};
