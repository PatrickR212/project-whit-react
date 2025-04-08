"use client" //Asegura que se ejecute solo en el cliente
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

//Importar el componente de mapa de Leaflet
import markerIconPng from "leaflet/dist/images/marker-icon.png";
import markerShadowPng from "leaflet/dist/images/marker-shadow.png";



//Importar el componente de mapa de Leaflet cargado dinámicamente
const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), {ssr:false});
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), {ssr:false});
const Marker = dynamic(() => import("react-leaflet").then((mod) => mod.Marker), {ssr:false});
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {ssr:false});


// Configurar los iconos de leaflet
const customIcon = L.icon({
    iconUrl: markerIconPng,
    shadowUrl: markerShadowPng,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});




export default function leafletMapComponent() {
    //constante para almacenar la posición del usuario
    const [isClient, setIsClient] = useState(false);

    //asegurarnos que el codigo se ejecute en cliente
    useEffect(() =>{
        setIsClient(true);
    }, []);

    // si el codigo no se ejecuta en el cliente, no renderizar
    if (!isClient) return <p>Cargando mapa...</p>

    // renderizar el mapa

    return (
        <MapContainer center={[4.142, -73.626]} zoom={13} style={{height: "80vh", width: "100%"}}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution= '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={[4.142, -73.626]} icon={customIcon}>
                <Popup>Villavicencio, Colombia.</Popup>
            </Marker>
        </MapContainer>
    );
}


