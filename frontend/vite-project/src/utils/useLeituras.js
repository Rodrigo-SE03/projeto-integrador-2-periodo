import { useEffect, useState } from 'react';
import axios from 'axios';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export default function useLeituras() {
    const [leituras, setLeituras] = useState([]);

    useEffect(() => {
        const buscarLocalizacoes = async () => {
            try {
                const resposta = await axios.get(`${BACKEND_URL}leituras`);
                const dados = resposta.data;

                // Garante que o último valor para cada MAC seja o mais recente
                const porMacMaisRecente = Object.values(
                    dados.reduce((acc, leitura) => {
                        acc[leitura.mac] = leitura; // sobrescreve sempre — o último "vence"
                        return acc;
                    }, {})
                );

                setLeituras(porMacMaisRecente);
            } catch (erro) {
                console.error('Erro ao buscar localizações:', erro);
            }
        };

        buscarLocalizacoes();

        const intervalo = setInterval(buscarLocalizacoes, 10000);
        return () => clearInterval(intervalo);
    }, []);

    return leituras;
}
