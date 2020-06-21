import { useState, useEffect } from "react";

interface GeolocationData {
    latitude: number;
    longitude: number;
}

export default function useLocation() {
    const [error, setError] = useState("");
    const [position, setPosition] = useState<GeolocationData>({
        latitude: 0,
        longitude: 0
    });

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            pos => {
                setError("");
                setPosition({
                    latitude: pos.coords.latitude,
                    longitude: pos.coords.longitude
                });
            },
            e => setError(e.message),
            {
                enableHighAccuracy: true,
                timeout: 15000,
                maximumAge: 0
            }
        );
    }, []);

    return { error, position };
}
