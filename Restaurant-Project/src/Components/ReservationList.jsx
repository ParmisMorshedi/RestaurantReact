import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function ReservationList() {
    const [reservations, setReservations] = useState([]);

    useEffect(() => {

            // Define an async function to fetch reservations
            async function fetchReservations() {
                try {
                    const response = await axios.get('https://localhost:7071/api/Reservation');
                    setReservations(response.data);
                } catch (error) {
                    console.log("Error fetching reservations:", error);
                }
        }

        fetchReservations();// Call the fetch function

    }, []); // Empty dependency array means this runs once on mount

    return (
        <div className="container">
            <h1>List of Reservations</h1>
            {loading ? (
                <p className="loading">Loading reservations...</p>
            ) : errorMessage ? (
                <p className="error">{errorMessage}</p>
            ) : reservations.length > 0 ? (
                <ul>
                    {reservations.map(reservation => (
                        <li key={reservation.reservationId}>
                            <b>Reservation date:</b> {new Date(reservation.date).toLocaleDateString()}<br />
                            <b>Time:</b> {reservation.time}<br />
                            <b>Number of Guests:</b> {reservation.numberOfGuests}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No reservations found.</p>
            )}
        </div>
    );
}