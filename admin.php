<?php
//Jakob Calvert
//20113992
//
//This php file is to execute ajax query to get the search results once the user has clicked a button

//sets variables
include 'settings.php';
//gets the user input for the search
$search = $_GET["search"]; 
$error = false;
$table = true;
//connects to the data base
$conn = mysqli_connect($host, $user, $pswd, $dbnm);

//checks the connection
if (!$conn) {
    $error = true;
}
//checks if the table exists
$sqlquery = "SELECT * FROM requests";
$result = mysqli_query($conn, $sqlquery);

if (!$result) {
    //if the table does not exist creates it
    $tableQuery = "CREATE TABLE requests (
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
    if (!mysqli_query($conn, $tableQuery)) {
        $error = true;
    }
}
//makes sure there was no error in creating the table
if (!$error) {
    //if the search is empty
    if ($search == "") {
        //gets all entrys from the table
        $sql = "SELECT * FROM requests";
        $bookingResult = mysqli_query($conn, $sql);
        //checks the query was succesful and there are more than 0 rows
        if ($bookingResult && mysqli_num_rows($bookingResult) > 0) {
            //create array
            $data = array();
            //loops through sql results 
            while ($row = mysqli_fetch_assoc($bookingResult)) {
                //conbines the pickup date and time
                $pickupDateTime = $row['pickup_date'] . ' ' . $row['pickup_time'];
                //checks if the date is within 2 hours of the current time
                if (isSoon($pickupDateTime)) {
                    //fills the array with the results 
                    $data[] = array(
                        'booking_number' => $row['booking_number'], 
                        'customerName' => $row['customer_name'],
                        'phoneNumber' => $row['phone_number'],
                        'suburb' => $row['suburb'],
                        'destinationSuburb' => $row['destination_suburb'],
                        'pickupDateTime' => $pickupDateTime,
                        'assignmentStatus' => $row['assignment_status']
                    );
                }
            }
     //if the array is empty sets the table variable as false
	 if (empty($data)){
		$table = false;
}
        } else {
            $table = false;
        }
        //if the user searches for a record
    } else {
        //selects results with the same booking number
        $sql = "SELECT * FROM requests WHERE booking_number = '$search'";
        $bookingResult = mysqli_query($conn, $sql);
        //makes sure there is a result
        if ($bookingResult && mysqli_num_rows($bookingResult) > 0) {
            $row = mysqli_fetch_assoc($bookingResult);
            //combines the time and the date
            $pickupDateTime = $row['pickup_date'] . ' ' . $row['pickup_time'];
            //fills the data into a array
            $data = array(array(
                'booking_number' => $row['booking_number'], 
                'customerName' => $row['customer_name'],
                'phoneNumber' => $row['phone_number'],
                'suburb' => $row['suburb'],
                'destinationSuburb' => $row['destination_suburb'],
                'pickupDateTime' => $pickupDateTime,
                'assignmentStatus' => $row['assignment_status']
            ));
            //if there are no results sets the table as false 
        } else {
            $table = false;
        }
    }
    //if there is a table and not error sends back the data array encoded with json
    if ($table && !$error) {
        $jsonData = json_encode($data);
        echo $jsonData;
        //if there is a error sends back error
    } else if ($error) {
        echo "error";
        //if the table variable is false meaning there is not table results sends back not entries were found
    } else {
        echo "No entries were found";
    }
}
//function to check if the current time is two hours less than the inserted time 
function isSoon($dateTime) {
    //gets the current time
    $currentTime = time();
    //makes the input time a time object
    $time = strtotime($dateTime);
    //calculates the seconds inbetween them
    $seconds = $time - $currentTime;
    //converts the seconds to hours
    $hours = $seconds / 3600;
    //checks the hours are beetween 0 and 2 returns logic
    if ($hours <= 2 && $hours > 0) {
        return true;
    } else {
        return false;
    }
}
?>
