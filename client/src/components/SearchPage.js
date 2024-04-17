import React, { useState } from 'react';
import { Table } from 'react-bootstrap';

function SearchPage(){
    const [searchName, setSearchName] = useState('');
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
  
    const handleSubmit = (e) => {
      e.preventDefault();
      console.log('Search Name:', searchName);
      console.log('Latitude:', latitude);
      console.log('Longitude:', longitude);
      
      const environment = 'development'
      const apiUrl = environment === 'development' ? 'http://localhost:3001' : 'https://production-domain.com:port';

      setLoading(true);
      setMessage('');
      const url = `${apiUrl}/search?q=${searchName}&latitude=${latitude}&longitude=${longitude}`;
      console.log(url)
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
                      <label htmlFor="searchName">Search by Name</label>
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
            {loading ? 'Searching...' : data.length === 0 ? message :  <SearchResultTable data={data}></SearchResultTable>}
        </div>
    )
}

function SearchResultTable({data}) {
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
  

export default SearchPage