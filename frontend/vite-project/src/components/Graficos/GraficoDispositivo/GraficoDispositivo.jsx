import axios from "axios";
import { useRef, useEffect, useState } from "react";
import styles from "./GraficoDispositivo.module.css";
import { calcularPercentual } from "../../../utils/classificarNivelBueiro";
import Chart from 'chart.js/auto';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const TIME_STEP = import.meta.env.VITE_TIME_STEP || (15*60*60);

const formatData = (leituras) => {
    const labels = leituras.map(leitura => new Date(leitura.timestamp).toLocaleString());
    const data = leituras.map(leitura => calcularPercentual(leitura.distancia, 110));
    return { labels, data };
};

function GraficoDispositivo({ mac_id, leituras }) {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);
    const [previsao, setPrevisao] = useState(null);
   
    const carregarPrevisao = async () => {
        try {
            const response = await axios.get(`${BACKEND_URL}lstm?mac=${mac_id}`);
            const data = response.data;
            setPrevisao(data.predicao);
        }
        catch (error) {
            console.error("Erro ao carregar previsões:", error);
        }
    }
    
    useEffect(() => {
        if (leituras.length > 0) {
          carregarPrevisao();
        }
      }, [leituras]);
      
    useEffect(() => {
        if (!chartRef.current || leituras.length === 0 || !previsao) return;
        
        const { labels, data } = formatData(leituras);
        const novosLabels = [...labels];
        const novosDadosPrevisao = [];
        
        const ultimoTimestamp = new Date(leituras[leituras.length - 1].timestamp).getTime();
        
        previsao.forEach((distanciaPrevista, i) => {
            const timestampPrevisto = new Date(ultimoTimestamp + (i + 1) * TIME_STEP * 1000);
            novosLabels.push(timestampPrevisto.toLocaleString());
            novosDadosPrevisao.push(calcularPercentual(distanciaPrevista, 110));
        });
        
        if (chartInstance.current) {
            chartInstance.current.destroy();
        }
        
        chartInstance.current = new Chart(chartRef.current, {
            type: 'line',
            data: {
            labels: novosLabels,
            datasets: [
                {
                label: 'Leituras do Dispositivo',
                data: data,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderWidth: 1,
                fill: true
                },
                {
                label: 'Previsão',
                data: Array(data.length).fill(null).concat(novosDadosPrevisao),
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderDash: [5, 5],
                borderWidth: 1,
                fill: false
                }
            ],
            },
            options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                beginAtZero: true,
                },
            },
            },
        });
    }, [leituras, previsao]);
      

    return (
        <div className={styles.graficoContainer}>
          <h2 className={styles.titulo}>Gráfico de Leituras do Dispositivo {mac_id}</h2>
          <div style={{ height: "300px" }}>
            <canvas ref={chartRef} className={styles.grafico}></canvas>
          </div>
        </div>
      );
};

export default GraficoDispositivo;