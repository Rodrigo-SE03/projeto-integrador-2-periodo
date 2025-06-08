import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import useLeituras from '../../utils/useLeituras';
import { classificarBueiro } from '../../utils/classificarNivelBueiro';
import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import greenIconImg from '../../assets/green_gps.png';
import orangeIconImg from '../../assets/orange_gps.png';
import redIconImg from '../../assets/red_gps.png';
import styles from './Mapa.module.css';
import RoutingControl from "./RoutingControl";



const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const greenIcon = L.icon({
  iconUrl: greenIconImg,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const orangeIcon = L.icon({
  iconUrl: orangeIconImg,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const redIcon = L.icon({
  iconUrl: redIconImg,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

// Versão destacada (ícone maior ou diferente)
const greenIconHighlight = L.icon({
  iconUrl: greenIconImg,
  iconSize: [42, 42], // maior para destacar
  iconAnchor: [24, 48],
  popupAnchor: [0, -48],
});

const orangeIconHighlight = L.icon({
  iconUrl: orangeIconImg,
  iconSize: [42, 42],
  iconAnchor: [24, 48],
  popupAnchor: [0, -48],
});

const redIconHighlight = L.icon({
  iconUrl: redIconImg,
  iconSize: [42, 42],
  iconAnchor: [24, 48],
  popupAnchor: [0, -48],
});

const normalIcon = (status) => {
  if (status === 'limpo') return greenIcon;
  if (status === 'parcial') return orangeIcon;
  if (status === 'cheio') return redIcon;
  return greenIcon;
};

const highlightedIcon = (status) => {
  if (status === 'limpo') return greenIconHighlight;
  if (status === 'parcial') return orangeIconHighlight;
  if (status === 'cheio') return redIconHighlight;
  return greenIconHighlight;
};

function Mapa ({ hovered=null, hoveredMac=null, rotaIdeal = [], setDistanciaRota }) {
    const navigate = useNavigate();
    const mapRef = useRef();
    const routingControlRef = useRef(null);
    const pontos = useLeituras();
    useEffect(() => {
        const buscarLocalizacoes = async () => {
          try {
            const resposta = await axios.get(`${BACKEND_URL}leituras`);	
            const dados = resposta.data;
            const porMacMaisRecente = Object.values(
              dados.reduce((acc, leitura) => {
                const existente = acc[leitura.mac];
                if (!existente || new Date(leitura.timestamp) > new Date(existente.timestamp)) {
                  acc[leitura.mac] = leitura;
                }
                return acc;
              }, {})
            );
          } catch (erro) {
            console.error('Erro ao buscar localizações:', erro);
          }
        };
      
        buscarLocalizacoes();
      
        const intervalo = setInterval(buscarLocalizacoes, 10000); // atualiza a cada 10 segundos
        return () => clearInterval(intervalo);
    }, []);

    return (
    <MapContainer
        center={[-16.6869, -49.2648]}
        zoom={12}
        zoomControl={true}
        className={styles.mapa}
        minZoom={4}
        maxZoom={16}
        whenCreated={(mapInstance) => {
          mapRef.current = mapInstance;
        }}
    >
        <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <RoutingControl rota={rotaIdeal} setDistancia={setDistanciaRota} />
        {rotaIdeal.length > 0 && (
          <Marker position={[rotaIdeal[0].latitude, rotaIdeal[0].longitude]}>
            <Popup>Ponto inicial da rota</Popup>
          </Marker>
        )}
        {pontos.map((ponto, i) => {
          const classificacao = classificarBueiro(ponto.distancia);
          const isStatusHighlighted = hovered ? (classificacao === hovered) : false;
          const isMacHighlighted = hoveredMac === ponto.mac;
          const icon = isStatusHighlighted || isMacHighlighted
            ? highlightedIcon(classificacao)
            : normalIcon(classificacao);
        
          const opacity = (hovered || hoveredMac)
            ? ((isStatusHighlighted || isMacHighlighted) ? 1 : 0.5)
            : 1;

          return (
            <Marker key={i} position={[ponto.latitude, ponto.longitude]} icon={icon} opacity={opacity}>
              <Popup>
                <button
                  onClick={() => navigate(`/dispositivo?id=${ponto.mac}`)}
                  style={{ cursor: 'pointer', background: 'none', border: 'none', color: '#007bff', textDecoration: 'underline' }}
                >
                  Ver dispositivo
                </button>
              </Popup>
            </Marker>
          );
        })}
    </MapContainer>
    );
};

export default Mapa;
