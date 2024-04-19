import React, { useState, useEffect } from 'react';
import { Table } from 'react-bootstrap';

function SearchPage() {
  const [searchName, setSearchName] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Alert after the state has been updated
  useEffect(() => {
    if (error) {
      alert(`Error: ${error}`);
    }
  }, [error]);

  // Validate the inputs
  const validateInputs = () => {
    setError('');

    if (searchName === '' || (Boolean(latitude) !== Boolean(longitude))) {
      setError('Either search name, latitude, and longitude or only the search name be provided.');
      return false;
    }

    if ((latitude && isNaN(Number(latitude))) || (longitude && isNaN(Number(longitude)))) {
      setError('Latitude and longitude must be numbers.');
      return false;
    }

    if (latitude && (Number(latitude) < -90 || Number(latitude) > 90)) {
      setError('Latitude must be between -90 and 90.');
      return false;
    }

    if (longitude && (Number(longitude) < -180 || Number(longitude) > 180)) {
      setError('Longitude must be between -180 and 180.');
      return false;
    }

    return true;
  }

  // process the inputs
  const inputProcess = () => {
    setSearchName(searchName.trim());
    setLatitude(latitude.trim());
    setLongitude(longitude.trim());
  }

  // handle click search button
  const handleSubmit = async (e) => {
    e.preventDefault();

    inputProcess();

    let isValid = validateInputs();
    if (!isValid) {
      console.log(`error ${error}`);
      return;
    }

    const domainUrl = 'http://localhost:3001';

    setLoading(true);
    setMessage('');

    const url = (latitude && longitude) ? `${domainUrl}/search?q=${searchName}&latitude=${latitude}&longitude=${longitude}` : `${domainUrl}/search?q=${searchName}`;
    fetch(url)
      .then(response => response.json())
      .then(data => {
        setData(data.suggestions);
        if (data.suggestions.length === 0) {
          setMessage('No results within 1000 km');
        }
        console.log(data)
        setLoading(false);
      })
      .catch(error => {
        console.error('Error:', error);
        setLoading(false);
      });

    setLoading(false);
  };

  return (
    <div className="search-container">
      <div className="container mt-5">
        <h1 className="text-center mb-5">Geolocation-based Search</h1>
        <form onSubmit={handleSubmit}>
          <div className="row mb-4">
            <div className="col-md-4">
              <div className="form-group">
                <label htmlFor="searchName">Search by Street Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="searchName"
                  placeholder="Enter name"
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-group">
                <label htmlFor="latitude">Latitude</label>
                <input
                  type="text"
                  className="form-control"
                  id="latitude"
                  placeholder="Enter latitude"
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-group">
                <label htmlFor="longitude">Longitude</label>
                <input
                  type="text"
                  className="form-control"
                  id="longitude"
                  placeholder="Enter longitude"
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                />
              </div>
            </div>
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>Search</button>
        </form>
      </div>
      <br></br>
      {loading ? 'Searching...' : data.length === 0 ? message : <SearchResultTable data={data}></SearchResultTable>}
    </div>
  )
}

function SearchResultTable({ data }) {
  return (
    <div className='container justify-content-center'>
      <Table striped bordered hover className="search-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Latitude</th>
            <th>Longitude</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{item.name}</td>
              <td>{item.latitude}</td>
              <td>{item.longitude}</td>
              <td>{item.score}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default SearchPage;
