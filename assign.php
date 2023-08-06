<?php
//Jakob Calvert
//20113992
//
//This php file is to execute ajax query to assign the assignment status of a certain booking number once the user has clicked the button


//incluede the settings php file
include "settings.php";

//connects to the data base
$error = false;
$conn = mysqli_connect($host, $user, $pswd, $dbnm);

//checks the connection
if (!$conn) {
    die("Connection failed");
}

//gets the booking number of the order
$bookingNumber = $_POST["bookingNum"];

//sets and executes sql query
$sqlquery = "UPDATE requests
        SET assignment_status = 'Assigned'
        WHERE booking_number = '$bookingNumber'";

$result = mysqli_query($conn, $sqlquery);

//if the order is successfully updated with assign  then echo assigned
if ($result === true) {
    echo "Assigned";
} else {
    echo "Unassigned";
}
//closes the connection
mysqli_close($conn);
?>
