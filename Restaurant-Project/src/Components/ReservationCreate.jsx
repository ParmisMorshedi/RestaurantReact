import { useEffect, useState } from 'react';
import axios from 'axios';
import './ReservationCreate.css'

export default function ReservationCreate({ refresh }) {

        // Define state variables for reservation details
    const [reservationDate, setReservationDate] = useState('');
    const [reservationTime, setReservationTime] = useState('');
    const [numberOfGuests, setNumberOfGuests] = useState(1);
    const [confirmationMessage, setConfirmationMessage] = useState('');

    // State for customers and tables
    const [customers, setCustomers] = useState([]);
    const [tables, setTables] = useState([]);
    const [selectedCustomerId, setSelectedCustomerId] = useState('');
    const [selectedTableId, setSelectedTableId] = useState('');

    // Default customers in case fetching fails
    const defaultCustomers = [
        { customerId: 1, name: "Parmis", email: "Parmis@gmail.com" },
        { customerId: 2, name: "Aldor", email: "Aldor@gmail.com" },
        { customerId: 4, name: "Alice Johnson", email: "alice.johnson@example.com" }
    ];

   
    useEffect(() => {

         // Function to fetch customers from the API
        async function fetchCustomers() {
            try {
                const response = await axios.get('https://localhost:7071/api/Customer');
              
                setCustomers(response.data);
            } catch (error) {
                console.error("Error fetching customers:", error);
                // If the backend call fails, use default customers
                setCustomers(defaultCustomers);
            }
        }

        // Function to fetch tables from the API
        async function fetchTables() {
            try {
                const response = await axios.get('https://localhost:7071/api/Table');
                console.log("Fetched tables:", response.data);
                setTables(response.data);
            } catch (error) {
                console.error("Error fetching tables:", error);
            }
        }

        fetchCustomers();
        fetchTables();
    }, []);
   
    // Function to handle form submission
    async function handleSubmit(e) {
        e.preventDefault(); // Prevent default form submission
        setConfirmationMessage(""); // Clear previous messages
        
        // Check if all required fields are filled
        if (!selectedTableId || !selectedCustomerId || !reservationDate || !reservationTime) {
            console.error("Please fill in all fields.");
            return; // Exit the function
        }
        
        try {
            // Create a reservation object with form data
            const reservation = {
                reservationId: 0,  // Placeholder ID, as this is a new reservation
                tableId: parseInt(selectedTableId), 
                customerId: parseInt(selectedCustomerId), 
                time: reservationTime + ":00", // Append seconds to the time
                date:`${reservationDate}T${reservationTime}:00`, // Combine date and time into one string
                numberOfGuests: parseInt(numberOfGuests),
            };
           
            
            // Make a POST request to create a reservation
            const response = await axios.post('https://localhost:7071/api/Reservation/AddReservation', reservation);
            console.log("Reservation created:", response.data);
            setConfirmationMessage("Reservation created successfully!");
           

        } catch (error) {
            console.error("Error creating reservation:", error.response?.data || error.message);
        if (error.response && error.response.data.errors) {
            const { errors } = error.response.data;
            const errorMessage = errors.reservationDTO?.[0] || errors.time?.[0] || "Error creating reservation.";
            setConfirmationMessage(errorMessage);
        } else {
            setConfirmationMessage("Error creating reservation.");
        }
        }
    }

    return (
        <div className="reservation-form">
            <h2>Create a Reservation</h2>
            <form onSubmit={handleSubmit}>
               <div className= 'form-group'>
                <label htmlFor='customerId'>Select Customer:</label>
                <select id='customerId'
                    value={selectedCustomerId}
                    onChange={(e) => setSelectedCustomerId(e.target.value)}
                    required
                >
                    
                    <option value='' disabled>Select a customer</option>
                    {customers.length > 0 ? (
                        customers.map(customer => (
                            <option key={customer.customerId} value={customer.customerId}>
                                {customer.name} - {customer.email}
                            </option>
                        ))
                    ) : (
                        <option value='' disabled>No customers available</option>
                    )}
                </select>
            </div>

            <div className='form-group'>
                <label htmlFor='tableId'>Select Table:</label>
                <select id='tableId'
                    value={selectedTableId}
                    onChange={(e) => setSelectedTableId(e.target.value)}
                    required
                >
                    <option value='' disabled>Select a table</option>
                    {tables.map(table => (
                        <option key={table.tableId} value={table.tableId}>
                            Table {table.number} - Seats: {table.seats}
                        </option>
                    ))}
                </select>
            </div>

            <div className='form-group'>
                <label htmlFor='reservationDate'>Reservation Date:</label>
                <input 
                    id='reservationDate'
                    type='date'
                    value={reservationDate}
                    onChange={(e) => setReservationDate(e.target.value)}
                    required
                />
            </div>

            <div className='form-group'>
            <label htmlFor='reservationTime'>Reservation Time:</label>
                <input
                    id='reservationTime'
                    type='time'
                    value={reservationTime}
                    onChange={(e) => setReservationTime(e.target.value)}
                    required
                />
            </div>

            <div className='form-group'>
            <label htmlFor='numberOfGuests'>Number of Guests:</label>
                <input
                    id='numberOfGuests'
                    type='number'
                    value={numberOfGuests}
                    onChange={(e) => setNumberOfGuests(e.target.value)}
                    required
                />
            </div>

                <button type='submit'>Create Reservation</button>
            </form>
            {confirmationMessage && <p>{confirmationMessage}</p>}
        </div> 
    );
}
