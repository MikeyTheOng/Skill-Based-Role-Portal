// check if the date is greater than today
export function validateGreaterTodayDate(date) {
    const inputDate = new Date(date); //mm-dd-yyyy or mm/dd/yyyy
    const currentDate = new Date();

    // Set the time part of both dates to midnight to ensure accurate comparison
    inputDate.setHours(0, 0, 0, 0);
    currentDate.setHours(0, 0, 0, 0);
    
    if (inputDate.getTime() >= currentDate.getTime()) {
      // console.log("The input date is greater than or equals to the current date");
      return true;
    } else {
      // console.log("The input date is not greater than the current date");
      return false;
    }
}