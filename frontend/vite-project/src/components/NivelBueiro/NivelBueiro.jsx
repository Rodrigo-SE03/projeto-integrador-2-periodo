import styles from './NivelBueiro.module.css';
import { CheckCircle, AlertTriangle, AlertCircle } from 'lucide-react';
import { classificarBueiro, calcularPercentual } from '../../utils/classificarNivelBueiro';

function NivelBueiro({ leituraAtual }) {
    const distanciaMax = 110
    const percentual = calcularPercentual(leituraAtual);

    let Icone;
    let cor;
    const status = classificarBueiro(leituraAtual);

    if (status === "limpo") {
        Icone = CheckCircle;
        cor = "#4caf50";
    } else if (status === "parcial") {
        Icone = AlertTriangle;
        cor = "#ffb300";
    } else {
        Icone = AlertCircle;
        cor = "#e53935";
    }

    return (
        <div className={styles.container}>
        <div className={styles.titulo}>Nível do Bueiro</div>
        <div className={styles.bueiro}>
            <div className={styles.agua} style={{ height: `${percentual}%` }}>
            <div className={styles.onda}></div>
            </div>
        </div>
        <div className={styles.status}>
            <Icone size={20} color={cor} />
            <span>{percentual.toFixed(0)}% cheio</span>
        </div>
        <p className={styles.valor}>Leitura: {leituraAtual} cm</p>
        </div>
    );
}

export default NivelBueiro;
