import React, { useState } from "react";

const LocationFetcher = () => {
    const [location, setLocation] = useState({
        latitude: null,
        longitude: null,
        address: "",
    });
    const [error, setError] = useState(null);

    const getLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const lat = position.coords.latitude;
                    const long = position.coords.longitude;
                    console.log("Latitude: ", lat, "Longitude: ", long);

                    // Update state
                    setLocation((prev) => ({
                        ...prev,
                        latitude: lat,
                        longitude: long,
                    }));

                    try {
                        // Fetch address using Google Maps Geocoding API
                        const response = await fetch(
                            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${long}&key=AIzaSyAgftgpKBgJWjovvPHAOUR-2nQCHXiKgUg`
                        );

                        const data = await response.json();

                        if (data.status === "OK" && data.results[0]) {
                            setLocation((prev) => ({
                                ...prev,
                                address: data.results[0].formatted_address,
                            }));
                        } else {
                            throw new Error("No results found for the given coordinates.");
                        }
                    } catch (err) {
                        console.error("Error fetching address: ", err.message);
                        setError(err.message);
                    }
                },
                (error) => {
                    switch (error.code) {
                        case error.PERMISSION_DENIED:
                            setError("Permission denied. Please allow location access.");
                            break;
                        case error.POSITION_UNAVAILABLE:
                            setError("Location information is unavailable.");
                            break;
                        case error.TIMEOUT:
                            setError("Request timed out. Please try again.");
                            break;
                        default:
                            setError("An unknown error occurred.");
                    }
                },
                { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
            );
        } else {
            setError("Geolocation is not supported by your browser.");
        }
    };

    return (
        <div>
            <h1>Get Current Location</h1>
            <button onClick={getLocation}>Fetch Location</button>
            {location.latitude && (
                <p>
                    Latitude: {location.latitude}, Longitude: {location.longitude}
                </p>
            )}
            {location.address && <p>Address: {location.address}</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    );
};

export default LocationFetcher;