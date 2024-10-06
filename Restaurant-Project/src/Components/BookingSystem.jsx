import React, { useState, useEffect } from "react";
import axios from "axios";
import TableList from "./TableList";
import ReservationCreate from "./ReservationCreate";
import './BookingSystem.css'; 

export default function BookingSystem() {
    const [reservationDate, setReservationDate] = useState("");
    const [reservationTime, setReservationTime] = useState("");
    const [availableTables, setAvailableTables] = useState([]);
    const [selectedTableId, setSelectedTableId] = useState(null);
    const [numberOfGuests, setNumberOfGuests] = useState(1);

    // Function to fetch available tables based on selected date and time
    const fetchAvailableTables = async () => {
        try {

            // Make a GET request to fetch available tables
            const response = await axios.get(`https://localhost:7071/api/Table/available-tables`, {
                params: {
                    date: reservationDate,// Include date in the request parameters
                    time: reservationTime,// Include time in the request parameters
                },
            });
            console.log(response.data); 
            setAvailableTables(response.data);// Update state with the fetched tables
        } catch (error) {
            console.error("Error fetching available tables:", error);
        }
    };

    // Function to handle table selection  
    const handleTableSelect = (tableId) => {
        setSelectedTableId(tableId);
    };

    // Function to refresh available tables after a reservation 
    const handleRefresh = () => {
    // This can be used to update data after booking
        fetchAvailableTables();// Call the function to fetch available tables again
    };

    useEffect(() => {
        // Check if both date and time are selected
        if (reservationDate && reservationTime) {
            fetchAvailableTables();// Fetch available tables based on the selected date and time
        }
    }, [reservationDate, reservationTime]);// Dependency array to re-run effect when date or time changes


    return (
        <div>
            <h1>Bookning System</h1>
           
           <form>
                <label>Select date:</label>
                <input 
                    type="date" 
                    value={reservationDate} 
                    onChange={(e) => setReservationDate(e.target.value)} 
                />

                <label>Select time:</label>
                <input 
                    type="time" 
                    value={reservationTime} 
                    onChange={(e) => setReservationTime(e.target.value)} 
                />

                {availableTables.length > 0 ? (
                    <TableList tables={availableTables} setSelectedTableId={handleTableSelect} />
                ) : (
                    <p>No tables available</p>
                )}

                {selectedTableId && (
                    <ReservationCreate 
                        tableId={selectedTableId} 
                        refresh={handleRefresh} 
                        numberOfGuests={numberOfGuests} 
                        setNumberOfGuests={setNumberOfGuests}
                    />
                )}
           </form>
        </div>
    );
}
