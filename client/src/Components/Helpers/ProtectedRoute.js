import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import apiUrl from './APIWrapper';

const checkAuth = async () => {
    try {
        const response = await axios.get(`${apiUrl}/check-auth`,
            {
                withCredentials: true
            }
        );
        if (response.status === 200) {
            return true;
        } else {
            throw new Error('Unauthorized');
        }
    } catch (error) {
        return false;
    };
};

const ProtectedRoute = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    useEffect(() => {
        const verifyAuth = async () => {
            const authStatus = await checkAuth();
            setIsAuthenticated(authStatus);
        };

        verifyAuth();
    }, []);
    if (isAuthenticated === null) {
        return <div className="loading-container">
            <div className="loading-circle"></div>
            <img className="backgroundBlock" src="/images/power.jpg" />
            <div className="backgroundBlock"></div>
        </div>;
    };
    return isAuthenticated ? children : <Navigate to="/" />;
};

export default ProtectedRoute;
