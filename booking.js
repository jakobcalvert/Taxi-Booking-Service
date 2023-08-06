//Jakob Calvert
//20113992
//
//This js file validates the data inputed by the user and then create a ajax request to insert the data in the table
//the function getData handles the ajax, validatePhoneNumber validates the phone number is the correct format and the 
//validateDateTime validates the date and time

//once the user clicks the submit button this function is called this funciton validates data then sends it to the php file
function getData(dataSource, divID, cname, phone, unumber, snumber, stname, sbname, dsbname, date, time) {
    //create XMLHttpRequest object
    var xhr = new XMLHttpRequest();
    run = true
    var error = document.getElementById("invalidInputDiv");
    error.innerHTML = "";

    //validates inputs are valid and prints appropriate error messages if they are not
    if (cname === "") {
        error.innerHTML += "Customer Name must be filled out<br>";
        run = false;
    } else if (cname.length > 255) {
        error.innerHTML += "Customer Name cannot exceed 255 characters<br>";
        run = false;
    }

    if (phone === "") {
        error.innerHTML += "Phone Number must be filled out<br>";
        run = false;
    } else if (!validatePhoneNumber(phone)) {
        error.innerHTML += "The phone number should be 10-12 digits long<br>";
        run = false;
    }

    if (unumber === "") {
        error.innerHTML += "Unit Number must be filled out<br>";
        run = false;
    } else if (unumber.length > 10) {
        error.innerHTML += "Unit Number cannot exceed 10 characters<br>";
        run = false;
    }


    if (snumber === "") {
        error.innerHTML += "Street Number must be filled out<br>";
        run = false;
    } else if (snumber.length > 10) {
        error.innerHTML += "Street Number cannot exceed 10 characters<br>";
        run = false;
    }

    if (stname === "") {
        error.innerHTML += "Street Name must be filled out<br>";
        run = false;
    } else if (stname.length > 255) {
        error.innerHTML += "Street Name cannot exceed 255 characters<br>";
        run = false;
    }

    if (sbname === "") {
        error.innerHTML += "Suburb must be filled out<br>";
        run = false;
    } else if (sbname.length > 255) {
        error.innerHTML += "Suburb cannot exceed 255 characters<br>";
        run = false;
    }

    if (dsbname === "") {
        error.innerHTML += "Destination Suburb must be filled out<br>";
        run = false;
    } else if (dsbname.length > 255) {
        error.innerHTML += "Destination Suburb cannot exceed 255 characters<br>";
        run = false;
    }

    if (date === "" || time === "") {
        error.innerHTML += "Date and time must be filled out<br>";
        run = false;
    } else if (!validateDateTime(date, time)) {
        error.innerHTML += "Selected date and time must be greater than the current date and time<br>";
        run = false;
    }

    //if there are no errors code may run
    if (run) {
        if (xhr) {
            //gets output plane
            var plane = document.getElementById(divID);
            //creates post request for ajax
            var requestbody =
                "cname=" + encodeURIComponent(cname) +
                "&phone=" + encodeURIComponent(phone) +
                "&unumber=" + encodeURIComponent(unumber) +
                "&snumber=" + encodeURIComponent(snumber) +
                "&stname=" + encodeURIComponent(stname) +
                "&sbname=" + encodeURIComponent(sbname) +
                "&dsbname=" + encodeURIComponent(dsbname) +
                "&date=" + encodeURIComponent(date) +
                "&time=" + encodeURIComponent(time);
            xhr.open("POST", dataSource, true);
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            //when the state changes checks if the code has finished executing
            xhr.onreadystatechange = function() {
                if (xhr.readyState == 4) {
                    if (xhr.status === 200) {
                        //trys to parse the response if it was succesful and then prints out the data
                        try {
                            var response = JSON.parse(xhr.responseText);
                            plane.innerHTML = "<h1>Thank you for booking!</h1>";
                            plane.innerHTML += "<label for='booking'>Booking reference number: </label> <div name='booking'>" + response.bookingNumber + "</div><br>";
                            plane.innerHTML += "<label for='time'>Pickup time: </label> <div name='time'>" + time + "</div><br>";
                            plane.innerHTML += "<label for='date'>Pickup date: </label> <div name='date'> " + date + "</div><br>";
                        } catch (error) {

                        }
                    } 
                }
            };
            xhr.send(requestbody);
        }
    }
}
//function to validate the phone number makes sure it is all digits and then makes sure it is only 10 - 12 numbers
function validatePhoneNumber(phoneNumber) {
    if (/^\d+$/.test(phoneNumber)) {
        if (phoneNumber.length >= 10 && phoneNumber.length <= 12) {
            return true;
        }
    }

    return false;
}
//function to validate the date and time gets the current date and time and makes sure the entered date and time are after it
function validateDateTime(date, time) {
    var currentDate = new Date(); // Get the current date and time
    var enterDate = new Date(date + "T" + time + ":00"); // Combine date and time

    if (enterDate <= currentDate) {
        return false;
    }

    return true;
}