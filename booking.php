<?php
//Jakob Calvert
//20113992
//
//This php file is to execute ajax query to get the search results once the user has clicked a button

//includes settings this file contains the data base connection information
include "settings.php";

//makes the sql connection
$error = false;
$conn = mysqli_connect($host, $user, $pswd, $dbnm);

// Check the connection
if (!$conn) {
    die("Connection failed");
}

// Gets all of the user inputs from the java script ajax query
$name = mysqli_real_escape_string($conn, $_POST["cname"]);
$phone = mysqli_real_escape_string($conn, $_POST["phone"]);
$unumber = mysqli_real_escape_string($conn, $_POST["unumber"]);
$snumber = mysqli_real_escape_string($conn, $_POST["snumber"]);
$stname = mysqli_real_escape_string($conn, $_POST["stname"]);
$sbname = mysqli_real_escape_string($conn, $_POST["sbname"]);
$dsbname = mysqli_real_escape_string($conn, $_POST["dsbname"]);
$date = mysqli_real_escape_string($conn, $_POST["date"]);
$time = mysqli_real_escape_string($conn, $_POST["time"]);
//turns time into a time php
$time = date("H:i", strtotime($time));
//sets all other variables
$assign = "Unassigned";
$currentDate = date("Y-m-d");
$currentTime = date("H:i:s");
//query to check table exists
$tableExistsQuery = "SELECT * FROM requests";
$tableExistsResult = mysqli_query($conn, $tableExistsQuery);
//if the table does not exist creates it
if (!$tableExistsResult) {
    
    $createTableQuery = "CREATE TABLE requests (
        booking_number VARCHAR(8) PRIMARY KEY,
        customer_name VARCHAR(255) NOT NULL,
        phone_number VARCHAR(12) NOT NULL,
        unit_number VARCHAR(10),
        street_number VARCHAR(10) NOT NULL,
        street_name VARCHAR(255) NOT NULL,
        suburb VARCHAR(255),
        destination_suburb VARCHAR(255),
        pickup_date DATE NOT NULL,
        pickup_time TIME NOT NULL,
        assignment_status VARCHAR(20),
        booking_date DATE NOT NULL,
        booking_time TIME NOT NULL
    );";
    //if the table could not be created prints error
    if (!mysqli_query($conn, $createTableQuery)) {
        echo "Error creating table<br>";
        $error = true;
    }
    mysqli_free_result($tableExistsResult);
}
//gets the top booking number form the table
$highBookingNumberResult = mysqli_query(
    $conn,
    "SELECT MAX(booking_number) AS max_booking_number FROM requests"
);
$row = mysqli_fetch_assoc($highBookingNumberResult);
$bookingNumber = $row["max_booking_number"];
//if there was no result starts from first booking number if it did return something the next booking number will be that booking number plus one
if (empty($bookingNumber)) {
    $bookingNumber = "BRN00001";
} else {
    $bookingNumber =
        "BRN" .
        str_pad(intval(substr($bookingNumber, 3)) + 1, 5, "0", STR_PAD_LEFT);
}
//creates query to insert new entry
$insertQuery = "INSERT INTO requests (
    booking_number,
    customer_name,
    phone_number,
    unit_number,
    street_number,
    street_name,
    suburb,
    destination_suburb,
    pickup_date,
    pickup_time,
    assignment_status,
    booking_date,
    booking_time
) VALUES (
    '$bookingNumber',
    '$name',
    '$phone',
    '$unumber',
    '$snumber',
    '$stname',
    '$sbname',
    '$dsbname',
    '$date',
    '$time',
    '$assign',
    '$currentDate',
    '$currentTime'
)";
//executes query
if (!mysqli_query($conn, $insertQuery)) {
    echo "Error inserting data";
    $error = true;
}
// Close the database connection
mysqli_close($conn);
//if there have been no errorsr returns the booking number time and the date and endcodes it in json
if (!$error) {
    $response = [
        "bookingNumber" => $bookingNumber,
        "time" => $time,
        "date" => date("d-m-Y", strtotime($date)),
    ];
    $jsonResponse = json_encode($response);
    echo $jsonResponse;
}
?>
