import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
    const [number, setNumber] = useState('');
    const [result, setResult] = useState('');
    const [values, setValues] = useState({});
    const [seenIndices, setSeenIndices] = useState([]);

    const calculateFibonacci = async () => {
        try {
            const response = await axios.get(`/api/fibonacci?number=${number}`);
            setResult(response.data.result);
        } catch (error) {
            console.error('Error calculating Fibonacci:', error);
            setResult('Error calculating Fibonacci');
        }
    };

    const fetchValues = async () => {
        try {
            const valuesResponse = await axios.get('/api/values/current');
            setValues(valuesResponse.data);
        } catch (error) {
            console.error('Error fetching values:', error);
        }
    };

    const fetchIndices = async () => {
        try {
            const seenIndicesResponse = await axios.get('/api/values/all');
            setSeenIndices(seenIndicesResponse.data);
        } catch (error) {
            console.error('Error fetching indices:', error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            await fetchValues();
            await fetchIndices();
        };
        fetchData();
    }, []);

    return (
        <div>
            <h1>Fibonacci Calculator</h1>
            <input
                type="number"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
            />
            <button onClick={calculateFibonacci}>Calculate</button>
            <p>{result && `Result: ${result}`}</p>

            <h3>Indices Seen:</h3>
            {seenIndices.map(({ number }) => number).join(', ')}

            <h3>Calculated Values:</h3>
            {Object.keys(values).map((key) => (
                <div key={key}>
                    For index {key}, the calculated value is {values[key]}
                </div>
            ))}
        </div>
    );
};

export default App;
