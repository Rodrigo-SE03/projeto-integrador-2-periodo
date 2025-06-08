import { CheckCircle, AlertTriangle, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import useLeituras from '../../utils/useLeituras';
import { classificarBueiro } from '../../utils/classificarNivelBueiro';
import styles from './Overview.module.css';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Overview({ handleHover, handleMacHover, calcularRota, distanciaRota }) {
    const leituras = useLeituras();
    const navigate = useNavigate();
    const [expanded, setExpanded] = useState(null);

    const dispositivos = {
        limpo: [],
        parcial: [],
        cheio: []
    };

    leituras.forEach(leitura => {
        const status = classificarBueiro(leitura.distancia);
        dispositivos[status].push(leitura);
    });

    const toggleExpand = (status) => {
        setExpanded(prev => prev === status ? null : status);
    };

    return (
        <div className={styles.content}>
            <h1>Visão geral</h1>
            <div className={styles.contentContainer}>
                <div
                    className={styles.limpo}
                    onMouseEnter={() => handleHover('limpo')}
                    onMouseLeave={() => handleHover(null)}
                >
                    <CheckCircle size={20} color="#4caf50" />
                    <span>Limpos - {dispositivos.limpo.length}</span>
                    <button className={styles.expandBtn} onClick={() => toggleExpand('limpo')}>
                        {expanded === 'limpo' ? <ChevronUp size={20} color="#4caf50" /> : <ChevronDown size={20} color="#4caf50" />}
                    </button>
                </div>
                {expanded === 'limpo' && (
                    <ul className={`${styles.listaDispositivos} ${styles[expanded]}`}>
                        {dispositivos.limpo.map((d) => (
                            <li 
                                key={d.mac} 
                                onClick={() => navigate(`/dispositivo?id=${d.mac}`)} 
                                className={styles.linkDispositivo} 
                                onMouseEnter={() => handleMacHover(d.mac)} 
                                onMouseLeave={() => handleMacHover(null)}
                            >
                                {d.rua}
                            </li>
                        ))}
                    </ul>
                )}

                <div
                    className={styles.parcial}
                    onMouseEnter={() => handleHover('parcial')}
                    onMouseLeave={() => handleHover(null)}
                >
                    <AlertTriangle size={26} color="#ffb300" />
                    <span>Parcialmente cheios - {dispositivos.parcial.length}</span>
                    <button className={styles.expandBtn} onClick={() => toggleExpand('parcial')}>
                        {expanded === 'parcial' ? <ChevronUp size={20} color="#ffb300" /> : <ChevronDown size={20} color="#ffb300" />}
                    </button>
                </div>
                {expanded === 'parcial' && (
                    <ul className={`${styles.listaDispositivos} ${styles[expanded]}`}>
                        {dispositivos.parcial.map((d) => (
                            <li 
                                key={d.mac} 
                                onClick={() => navigate(`/dispositivo?id=${d.mac}`)} 
                                className={styles.linkDispositivo} 
                                onMouseEnter={() => handleMacHover(d.mac)} 
                                onMouseLeave={() => handleMacHover(null)}
                            >
                                {d.rua}
                            </li>
                        ))}
                    </ul>
                )}

                <div
                    className={styles.cheio}
                    onMouseEnter={() => handleHover('cheio')}
                    onMouseLeave={() => handleHover(null)}
                >
                    <AlertCircle size={20} color="#e53935" />
                    <span>Cheios - {dispositivos.cheio.length}</span>
                    <button className={styles.expandBtn} onClick={() => toggleExpand('cheio')}>
                        {expanded === 'cheio' ? <ChevronUp size={20} color="#e53935" /> : <ChevronDown size={20} color="#e53935" />}
                    </button>
                </div>
                {expanded === 'cheio' && (
                    <ul className={`${styles.listaDispositivos} ${styles[expanded]}`}>
                        {dispositivos.cheio.map((d) => (
                            <li 
                                key={d.mac} 
                                onClick={() => navigate(`/dispositivo?id=${d.mac}`)} 
                                className={styles.linkDispositivo} 
                                onMouseEnter={() => handleMacHover(d.mac)} 
                                onMouseLeave={() => handleMacHover(null)}
                            >
                                {d.rua}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            <button className={styles.routeButton} onClick={calcularRota}>Calcular Rota</button>
            {distanciaRota != 0 && (
                <div className={styles.distanciaRota}>
                    <span>Distância da rota ideal:<br/>{distanciaRota.toFixed(2)} km</span>
                </div>
            )}
        </div>
    );
}

export default Overview;