import styles from './TabelaLeituras.module.css';

function TabelaLeituras({ leituras }) {
  if (!leituras.length) {
    return <p className={styles.aviso}>Nenhuma leitura registrada ainda.</p>;
  }

  return (
    <div className={styles.tabelaContainer}>
      <table className={styles.tabela}>
        <thead>
          <tr>
            <th>Distância</th>
            <th>Horário</th>
            <th>Latitude</th>
            <th>Longitude</th>
            <th>MAC</th>
          </tr>
        </thead>
        <tbody>
          {[...leituras].reverse().map((leitura, index) => (
            <tr key={index}>
              <td>{leitura.distancia} cm</td>
              <td>{leitura.timestamp}</td>
              <td>{leitura.latitude.toFixed(6)}</td>
              <td>{leitura.longitude.toFixed(6)}</td>
              <td>{leitura.mac}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TabelaLeituras;
