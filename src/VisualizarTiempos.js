import React from 'react';

function VisualizarTiempos({ axiosTime, fetchTime }) {
  return (
    <div className="App-timings">
      <p>Último tiempo con Axios: {axiosTime}ms</p>
      <p>Último tiempo con Fetch: {fetchTime}ms</p>
    </div>
  );
}

export default VisualizarTiempos;