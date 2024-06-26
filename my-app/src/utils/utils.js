// check if the date is greater than today
export function validateGreaterTodayDate(date) {
    const inputDate = new Date(date); //mm-dd-yyyy or mm/dd/yyyy
    const currentDate = new Date();
    console.log()
    if (inputDate.getTime() > currentDate.getTime()) {
      console.log("The input date is greater than the current date");
      return true;
    } else {
      console.log("The input date is not greater than the current date");
      return false;
    }
}

// remove time from db date
export function formatDateWithoutTime(dateString) {
  const dateObject = new Date(dateString);
  return dateObject.toDateString();
}

module.exports = {
  validateGreaterTodayDate,
  formatDateWithoutTime,
};