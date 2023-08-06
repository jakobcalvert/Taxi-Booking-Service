//Jakob Calvert
//20113992
//
//This js creates a ajax request to get the table from the search query in the get data function it will then create the table using the
// makeTable function and append the rows of the data on to the table using the appendRow function this file also handles when the user 
// changes the assigned status by clicking a button the onclick event is added to the button in the append row and then is handled by the
// assign function where it make another ajax request to the assign.php file where it assigns it in the table and returns the results.

//makes sure the xml request object used to create ajax requests
var xhr = new XMLHttpRequest();

//get data function handles when the search button is pressed
function getData(dataSource, divID, search) {
    //checks xhr variable is set
    if (xhr) {
        //gets the content tag in html for the results
        var result = document.getElementsByClassName("content")[0];
        //gets the search input
        var searchValue = document.getElementById(search).value;
        //checks the search input is in the valid format or empty
        if (/BRN\d{5}$/.test(searchValue) || searchValue == "") {
            //creates ajax request with the data
            var requestUrl = dataSource + "?search=" + encodeURIComponent(searchValue);
            xhr.open("GET", requestUrl, true);
            //when the xhr object changes states checks if the query has finished executing
            xhr.onreadystatechange = function() {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    //if the query is done checks the results if the result is a error or empty prints corresponding messages
                    if (xhr.responseText == "error") {
                        result.innerHTML = xhr.responseText;
                    } else if (xhr.responseText == "No entries were found") {
                        result.innerHTML = "No entries were found";
                    } else {
                        //if the data is valid parses it out of json
                        var data = JSON.parse(xhr.responseText);
                        //makes the table
                        makeTable();
                        //loops through the data adding it to the table
                        data.forEach(function(entry) {
                            appendRow(
                                entry.booking_number,
                                entry.customerName,
                                entry.phoneNumber,
                                entry.suburb,
                                entry.destinationSuburb,
                                entry.pickupDateTime,
                                entry.assignmentStatus
                            );
                        });
                    }
                }
            };
            xhr.send();
        } else {
            //if the input was not in a valid state prints this message
            result.innerHTML = "The search input is in a invalid format";

        }
    }
}
//function to make table
function makeTable() {
    //gets the content tag where the table will be located 
    var result = document.getElementsByClassName("content")[0];
    //clears 
    result.innerHTML = "";
    //creates table tags
    var theTable = document.createElement("table");
    theTable.id = "tbl";
    //adds a new line inbetween and inserts the table
    result.appendChild(document.createElement("br"));
    result.appendChild(theTable);

    //creates the table body
    var tBody = document.createElement("tbody");

    //creates new row
    var newRow = document.createElement("tr");
    //creates table header then names it then adds to row does this for all headings 
    var c1 = document.createElement("th");
    var v1 = document.createTextNode("Booking Reference Number");
    c1.appendChild(v1);
    newRow.appendChild(c1);

    var c2 = document.createElement("th");
    var v2 = document.createTextNode("Customer Name");
    c2.appendChild(v2);
    newRow.appendChild(c2);

    var c3 = document.createElement("th");
    var v3 = document.createTextNode("Phone");
    c3.appendChild(v3);
    newRow.appendChild(c3);

    var c4 = document.createElement("th");
    var v4 = document.createTextNode("Pickup Suburb");
    c4.appendChild(v4);
    newRow.appendChild(c4);

    var c5 = document.createElement("th");
    var v5 = document.createTextNode("Destination Suburb");
    c5.appendChild(v5);
    newRow.appendChild(c5);

    var c6 = document.createElement("th");
    var v6 = document.createTextNode("Pickup Date and Time");
    c6.appendChild(v6);
    newRow.appendChild(c6);

    var c7 = document.createElement("th");
    var v7 = document.createTextNode("Status");
    c7.appendChild(v7);
    newRow.appendChild(c7);

    var c8 = document.createElement("th");
    var v8 = document.createTextNode("Assign");
    c8.appendChild(v8);
    newRow.appendChild(c8);

    //adds the new row to the table
    tBody.appendChild(newRow);
    theTable.appendChild(tBody);
}
//function to add a new row to the table
function appendRow(bookingNum, customerName, phone, pickup, dest, pickupTime, status) {
    //gets the table and the table body
    var theTable = document.getElementById("tbl");
    var tBody = theTable.getElementsByTagName("tbody")[0];

    //creates new row
    var newRow = document.createElement("tr");

    //create the entry for the booking number 
    var c1 = document.createElement("td");
    var v1 = document.createTextNode(bookingNum);
    //adds the entry to the table cell then the row
    c1.appendChild(v1);
    newRow.appendChild(c1);
    //does this for all inputs

    var c2 = document.createElement("td");
    var v2 = document.createTextNode(customerName);
    c2.appendChild(v2);
    newRow.appendChild(c2);

    var c3 = document.createElement("td");
    var v3 = document.createTextNode(phone);
    c3.appendChild(v3);
    newRow.appendChild(c3);

    var c4 = document.createElement("td");
    var v4 = document.createTextNode(pickup);
    c4.appendChild(v4);
    newRow.appendChild(c4);

    var c5 = document.createElement("td");
    var v5 = document.createTextNode(dest);
    c5.appendChild(v5);
    newRow.appendChild(c5);

    var c6 = document.createElement("td");
    var v6 = document.createTextNode(pickupTime);
    c6.appendChild(v6);
    newRow.appendChild(c6);

    var c7 = document.createElement("td");
    var v7 = document.createTextNode(status);
    c7.appendChild(v7);
    newRow.appendChild(c7);

    //for this cell a button is created
    var c8 = document.createElement("td");
    var v8 = document.createElement("button");
    v8.textContent = "Assign";
    //for the button it will check if the data for status was assigned or unassigned and disable or enable button accordingly
    if (status === "Unassigned") {
        v8.disabled = false;
    } else {
        v8.disabled = true;
    }
    //adds a click event to the button that passes the booking number to the assign function along with cell 7 and the button
    v8.onclick = function() {
        assign(bookingNum, c7, v8);
    };
    //adds the button to the cell and then cell to the row
    c8.appendChild(v8);
    newRow.appendChild(c8);
    //adds the row to the table
    tBody.appendChild(newRow);
}
//this function create a ajax request to the assign php file to make the status of a certain booking request assigned
function assign(bookingNum, status, button) {
    if (xhr) {
        //creates the xhr request
        var requestbody = "bookingNum=" + encodeURIComponent(bookingNum);
        xhr.open("POST", 'assign.php', true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        //on each state change checks if query is complete
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4 && xhr.status == 200) {
                //once the query is complete sets the status to the returned results 
                status.innerHTML = xhr.responseText;
                //if it has been assigned prints message saying it has been assigned and then disables button
                if (xhr.responseText == "Assigned") {
                    var text = document.createElement('h1');
                    text.textContent = "Congratulations! Booking request " + bookingNum + " has been assigned!";
                    var contentDiv = document.getElementsByClassName("content")[0];
                    contentDiv.insertBefore(text, contentDiv.firstChild);
                    button.disabled = true;
                }

            }
        };
        xhr.send(requestbody);
    }

}