import React from 'react';
import './BookingSystem.css'; 

// Define the TableList component which receives props: tables and setSelectedTableId
export default function TableList({ tables, setSelectedTableId }) {
    return (
        <div className="container">
        <h2> Availabe Tables</h2>
        {tables.length > 0 ? (
            <ul>
                {tables.map(table => (
                    <li key={table.tableId} onClick={() => setSelectedTableId(table.tableId)} style={{ cursor: 'pointer' }}>
                        <b>Table number:</b> {table.number}, <b>Seats:</b> {table.seats}
                    </li>
                ))}
            </ul>
        ) : (
            <p>No tables available</p>
        )}
    </div>
    );
};
