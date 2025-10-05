// src/Context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Store token in state
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [refreshToken, setRefreshToken] = useState(localStorage.getItem("refreshtoken") || null);
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(
    JSON.parse(localStorage.getItem("userInfo")) || null
  );

  // Login function
  const login = async (email, password) => {
    const resp = await authFetch("http://84.247.135.231:8080/api/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!resp.ok) {
      throw new Error("Invalid credentials");
    }

    const data = await resp.json();
    console.log("Login response:", data);

    const accessToken = data.token.access_token;
    const refreshtoken = data.token.refresh_token;
    const userInfo = data.token.user_info; 

    // Save token in state and localStorage
    setToken(accessToken);
    setRefreshToken(refreshtoken);
    setUserInfo(userInfo);
    localStorage.setItem("token", accessToken);
    localStorage.setItem("refreshtoken", refreshtoken);
    localStorage.setItem("userInfo", JSON.stringify(userInfo));

    return { accessToken, userInfo };
  };

  // Logout function
  const logout = () => {
    setToken(null);
    setRefreshToken(null);
    setUserInfo(null);
    localStorage.removeItem("token");
    localStorage.removeItem("refreshtoken");
    localStorage.removeItem("userInfo");
    navigate("/login");
  };

  const authFetch = async (url, options = {}) => {
    // Add Authorization header automatically
    if (!options.headers) options.headers = {};
    if (token) options.headers["Authorization"] = `Bearer ${token}`;
    
    // Only set Content-Type if not already specified
    if (!options.headers["Content-Type"]) {
      options.headers["Content-Type"] = "application/json";
    }

    try {
      // Make the request
      let response = await fetch(url, options);    
      // Handle !response.ok -> refresh token logic
      if (!response.ok && refreshToken) {
        const clientId = "microservices-client";
        const clientSecret = "xzqSYMI1pzumAj9BGD7BSKhI3IFAwy5e";

        const refreshResp = await fetch("http://84.247.135.231:8180/realms/microservices/protocol/openid-connect/token", {
          method: "POST",
          headers: { 
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": "Basic " + btoa(`${clientId}:${clientSecret}`)
          },
          body: new URLSearchParams({
            grant_type: "refresh_token",
            refresh_token: refreshToken,
          }),
        });

        if (!refreshResp.ok) {
          throw new Error("token Session expired");
        }
        
        const data = await refreshResp.json();
        setToken(data.access_token);
        setRefreshToken(data.refresh_token);
        
        // UPDATE localStorage during refresh
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("refreshtoken", data.refresh_token);

        // Retry the original request with new token (only once)
        options.headers["Authorization"] = `Bearer ${data.access_token}`;
        response = await fetch(url, options);
      }

      return response;
    } catch (error) {
      // Handle CORS/network errors
      if (refreshToken) {
        try {
          const clientId = "microservices-client";
          const clientSecret = "xzqSYMI1pzumAj9BGD7BSKhI3IFAwy5e";

          const refreshResp = await fetch("http://84.247.135.231:8180/realms/microservices/protocol/openid-connect/token", {
            method: "POST",
            headers: { 
              "Content-Type": "application/x-www-form-urlencoded",
              "Authorization": "Basic " + btoa(`${clientId}:${clientSecret}`)
            },
            body: new URLSearchParams({
              grant_type: "refresh_token",
              refresh_token: refreshToken,
            }),
          });

          if (!refreshResp.ok) throw new Error("Session expired token");

          const data = await refreshResp.json();
          setToken(data.access_token);
          setRefreshToken(data.refresh_token);
          
          // UPDATE localStorage during refresh
          localStorage.setItem("token", data.access_token);
          localStorage.setItem("refreshtoken", data.refresh_token);

          // Retry the original request with new token
          options.headers["Authorization"] = `Bearer ${data.access_token}`;
          return await fetch(url, options);
        } catch (refreshError) {
          //logout();
          throw new Error("Session expired");
        }
      }
      
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ token, userInfo, login, logout, authFetch }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = () => useContext(AuthContext);