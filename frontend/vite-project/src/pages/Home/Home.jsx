import styles from "./Home.module.css";
import Mapa from "../../components/Mapa/Mapa";
import Overview from "../../components/Overview/Overview";
import { useState } from "react";
import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

function Home({}) {
    const [hoveredStatus, setHoveredStatus] = useState(null);
    const [hoveredMac, setHoveredMac] = useState(null);
    const [rotaIdeal, setRotaIdeal] = useState([]);
    const [distanciaRota, setDistanciaRota] = useState(0);

    const calcularRota = async () => {
    try {
        const response = await axios.get(`${BACKEND_URL}rotas`);
        const rota = response.data[0];
        setRotaIdeal(rota);
    } catch (erro) {
        console.error("Erro ao calcular rota:", erro);
    }
    };

    return (
        <div className={styles.pageContent}>
            <h1>Bueiros Inteligentes</h1>
            <div className={styles.contentContainer}>
                <Overview handleHover={setHoveredStatus} handleMacHover={setHoveredMac} calcularRota={calcularRota} distanciaRota={distanciaRota} />
                <Mapa hovered={hoveredStatus} hoveredMac={hoveredMac} rotaIdeal={rotaIdeal} setDistanciaRota={setDistanciaRota} />
            </div>
        </div>
    );
} 

export default Home;