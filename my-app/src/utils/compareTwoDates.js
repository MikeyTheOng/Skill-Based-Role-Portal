export function compareTwoDates(firstDate, secondDate) {
    const startDate = new Date(firstDate); // First date to compare
    const endDate = new Date(secondDate); // Second date to compare
    if (endDate.getTime() > startDate.getTime()) {
        // console.log("end date is greater than start date");
        return false;
    } else {
        // console.log("end date is less than start");
        return true;
    }
}