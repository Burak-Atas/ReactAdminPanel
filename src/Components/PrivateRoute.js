// src/Components/PrivateRoute.js
import { Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Navbar from './Navbar';

const PrivateRoute = ({ element: Component, withNavbar = true }) => {
  const [isAuthenticated, setIsAuthenticated] = useState();

  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log("token",!!token)
    setIsAuthenticated(!!token);
  }, []);

  if (!isAuthenticated) {
    console.log(isAuthenticated)
    console.log("nul",!isAuthenticated)
    return <Navigate to="/login" />;
  }

  return withNavbar ? (
    <div className="flex w-full">
      <div className="w-1/5">
        <Navbar />
      </div>
      <div className="w-4/5">
        <Component />
      </div>
    </div>
  ) : (
    <Component />
  );
};

export default PrivateRoute;
