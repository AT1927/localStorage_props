import { useState, useCallback } from 'react';
import Person from './Person';
import SearchForm from './SearchForm';
import './App.css';
import axios from 'axios';

function App() {
  // Estados
  const [people, setPeople] = useState({ axios: [], fetch: [] });
  const [gender, setGender] = useState('');
  const [country, setCountry] = useState('US');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingType, setLoadingType] = useState(''); // 'axios', 'fetch', 'compare'
  const url = `https://randomuser.me/api/?results=12&gender=${gender}&nat=${country}`;
  {/*Función optimizada con Axios*/}
  const findPeopleAxios = useCallback(async () => {
    if (isLoading) return;
    setIsLoading(true);
    setLoadingType('axios');
    setPeople({ axios: [], fetch: [] }); // Limpiar datos antes de cargar nuevos

    try {
      const { data: { results } } = await axios.get(url);
      setPeople(prev => ({ ...prev, axios: results }));
    } catch (error) {
      console.error(`Error en Axios: ${error.message}`);
    } finally {
      setTimeout(() => setIsLoading(false), 500);
    }
  }, [gender, country, isLoading]);

  {/*Función usando Fetch con corrección en el estado*/}
  const findPeopleFetch = useCallback(async () => {
    if (isLoading) return;
    setIsLoading(true);
    setLoadingType('fetch');
    setPeople({ axios: [], fetch: [] });

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`);

      const { results } = await response.json();
      setPeople(prev => ({ ...prev, fetch: results }));
    } catch (error) {
      console.error(`Error en Fetch: ${error.message}`);
    } finally {
      setTimeout(() => setIsLoading(false), 500);
    }
  }, [gender, country, isLoading]);

  {/*Comparar tiempos con Promise.all() corregido*/}
  const compareRequests = useCallback(async () => {
    if (isLoading) return;
    setIsLoading(true);
    setLoadingType('compare');
    setPeople({ axios: [], fetch: [] });

    try {
      const axiosStart = performance.now();
      const axiosPromise = axios.get(url).then(res => {
        console.log(`Axios tomó: ${(performance.now() - axiosStart).toFixed(2)}ms`);
        
        return res.data.results;
      });

      const fetchStart = performance.now();
      const fetchPromise = fetch(url)
        .then(async res => {
          if (!res.ok) throw new Error(`Error HTTP: ${res.status} - ${res.statusText}`);
          const data = await res.json();
          console.log(`Fetch tomó: ${(performance.now() - fetchStart).toFixed(2)}ms`);
          return data.results;
        });

      const [axiosResponse, fetchResponse] = await Promise.all([axiosPromise, fetchPromise]);

      setPeople({ axios: axiosResponse, fetch: fetchResponse });
    } catch (error) {
      console.error(`Error en comparación: ${error.message}`);
    } finally {
      setTimeout(() => setIsLoading(false), 500);
    }
  }, [gender, country, isLoading]);

  {/*Manejo de cambios en género y país*/}
  const handleGender = (event) => setGender(event.target.value);
  const handleCountry = (event) => setCountry(event.target.value);

  return (
    <div className="App">
      <h1>Random People</h1>

      <SearchForm handleGender={handleGender} handleCountry={handleCountry} country={country} />

      {/* Ajustando la disposición de botones y estados */}
      <div className="App-controls">
        <button onClick={findPeopleAxios} disabled={isLoading} className="btn">
          {isLoading && loadingType === 'axios' ? "Cargando..." : "Buscar con Axios"}
        </button>
        <button onClick={findPeopleFetch} disabled={isLoading} className="btn">
          {isLoading && loadingType === 'fetch' ? "Cargando..." : "Buscar con Fetch"}
        </button>
        <button onClick={compareRequests} disabled={isLoading} className="btn">
          {isLoading && loadingType === 'compare' ? "Cargando..." : "Comparar Axios vs Fetch"}
        </button>
      </div>

      {/* Mostrar resultados en filas de 3 columnas ajustando el CSS */}
      <div className="App-results">
        <div className="result-section">
          <h2>Resultados con Axios </h2>
          {isLoading && loadingType === 'axios' && <p>Cargando datos...</p>}
          <div className="people-grid">
            {people.axios.length > 0 ? (
              people.axios.map(person => <Person key={person.login.uuid} person={person} />)
            ) : (
              !isLoading && <p>No hay resultados</p>
            )}
          </div>
        </div>

        <div className="result-section">
          <h2>Resultados con Fetch</h2>
          {isLoading && loadingType === 'fetch' && <p>Cargando datos...</p>}
          <div className="people-grid">
            {people.fetch.length > 0 ? (
              people.fetch.map(person => <Person key={person.login.uuid} person={person} />)
            ) : (
              !isLoading && <p>No hay resultados</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
