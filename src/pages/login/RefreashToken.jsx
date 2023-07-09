import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import jwt_decode from "jwt-decode";

function RefreshToken(token) {
  const navigateTo = useNavigate();
  const existingToken = token
  useEffect(() => {
    if (existingToken) {
      const decodedToken = jwt_decode(existingToken);
      const expirationTime = decodedToken.exp * 1000;
      const currentTime = Date.now();

      // Check if the token has expired
      if (currentTime > expirationTime) {
        console.log('Token expired');
        navigateTo('/login');
      }
      else {
        console.log(`Refreshing token`,existingToken)
        // No token found, navigate to login
        console.log('Token not expired');
      }
    } 
  }, [existingToken, navigateTo]);

  return null;
}

export default RefreshToken;
