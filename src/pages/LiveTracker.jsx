import React, { useState, useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const LiveTracker = () => {
  const [location, setLocation] = useState({
    latitude: 0,
    longitude: 0,
    speed: 0,
    altitude: 0,
    heading: 0,
    accuracy: 0,
  });
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);

  useEffect(() => {
    if ('geolocation' in navigator) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude, speed, altitude, heading, accuracy } = position.coords;
          setLocation({ latitude, longitude, speed, altitude, heading, accuracy });
        },
        (error) => {
          console.error('Error getting location:', error.message);
        }
      );

      return () => {
        navigator.geolocation.clearWatch(watchId);
      };
    } else {
      console.error('Geolocation is not supported by your browser');
    }
  }, []);

  useEffect(() => {
    // Initialize the map only once on component mount
    const newMap = L.map('map').setView([0, 0], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(newMap);

    // Create a marker
    const newMarker = L.marker([0, 0]).addTo(newMap);
    setMarker(newMarker);

    setMap(newMap); 

    return () => {
      newMap.remove();
    };
  }, []); 
  
  useEffect(() => {
    // Update the marker position when the location changes
    if (map && marker) {
      if (!marker._latlng.lat) {
        marker.setLatLng([location.latitude, location.longitude]).addTo(map);
      } else {
        marker.setLatLng([location.latitude, location.longitude]);
      }

      map.panTo([location.latitude, location.longitude]);
    }
  }, [location, map, marker]);

  return (
    <div>
      <h1>Live Location Tracker</h1>
      <div id="map" style={{ height: '400px' }}></div>
      {location && (
        <div>
          <p>Latitude: {location.latitude}</p>
          <p>Longitude: {location.longitude}</p>
          <p>Speed: {location.speed} m/s</p>
          <p>Altitude: {location.altitude} meters</p>
          <p>Heading: {location.heading} degrees</p>
          <p>Accuracy: {location.accuracy} meters</p>
        </div>
      )}
    </div>
  );
};

export default LiveTracker;
