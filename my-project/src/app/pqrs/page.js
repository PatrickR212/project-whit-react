"use client";

//Importaciones requeridas
import{ useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Toast, ToastContainer } from "react-bootstrap";

//importaciones de los estilos
import styles from "@/styles/pqrs.module.css";

// import mapa
import Mapcomponent from "../components/MapComponent";


import React from "react";

export default function pqrs() {

    const [formData, setForData ] = useState({
        name: "",
        email: "",
        message: "",
    });

    // Manejar el estado de carga
    const [loading, setLoading] = useState(false);
    // Estado para mostrar la notificación
    const [showToast, setShowToast] = useState(false);
    //Manejo del mensaje del toast
    const [ toastMessage, setToastMessage ] = useState("");
    //Color del toast 
    const [toastVariant, setToastVariant] = useState("success");

    //Manejando el cambio de los inputs
    const handleChange = (e) => {
        setForData({ ...formData, [e.target.name]: e.target.value});
    }

    //Manejo del envio del formulario 
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        //try
        try{
            const response = await fetch("/api/send-email",{
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(formData)
            })

            const result = await response.json();

            if(response.ok){
                setToastMessage("Correo enviado con éxito");
                setToastVariant("Success");
                // Ayuda a Reset
                setForData({name: "", message: ""})
            }else{
                setToastMessage(`Error al enviar el correo: ${result.error}`);
                setToastVariant("danger");
            }

        }catch (error){
            setToastMessage("Hubo un problema al enviar el correo");
            setToastVariant("danger");
            console.error("Error: ", error);
        } finally{
            setShowToast(true); // Mostrar notificaciones
            setLoading(false);
        }   
    };

    return(
        <div className={styles.intro}>
            {/* Notificaciones con Bootstrap */}

            <ToastContainer position="top-end" className="p-3">
                <Toast bg={toastVariant} show={showToast} onClose={() => setShowToast(false)} delay={3000} autohide>
                  <Toast.Body className="text-white">{toastMessage}</Toast.Body>
                </Toast>
            </ToastContainer>

            {/* Incorporar el component del mapa */}
            <div>
                <Mapcomponent />
            </div>

            {/* Contenedor del form */}
            <div className={styles.form}>
                <h1>Contacto </h1>
                <form onSubmit={handleSubmit}>
                    <label>Nombre:</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="Ingresa tu nombre"/>
                    <label>Email:</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="Ingresa tu email"/>
                    <label>Mensaje:</label>
                    <textarea name="message" value={formData.message} onChange={handleChange} required/>

                    <button type="submit" disabled= {loading}>
                        {loading ? "Enviando..." : "Enviar"}
                    </button>
                </form>
            </div>


        </div>
    );
}
