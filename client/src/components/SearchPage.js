import React, { useState } from 'react';
import { Table } from 'react-bootstrap';

function SearchPage(){
    const [data, setData] = useState([]);
    
    return (
        <div className="search-container">
            <SearchBar></SearchBar>
            <br></br>
            <SearchResultTable></SearchResultTable>
        </div>
    )
}

function SearchBar() {
    const [searchName, setSearchName] = useState('');
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
  
    const handleSubmit = (e) => {
      e.preventDefault();
      console.log('Search Name:', searchName);
      console.log('Latitude:', latitude);
      console.log('Longitude:', longitude);
    };
  
    return (
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
          <button type="submit" className="btn btn-primary">Search</button>
        </form>
      </div>
    );
  }

function SearchResultTable() {
    const data =  [
          { name: "London, ON, Canada", latitude: "42.98339", longitude: "-81.23304", score: 0.9 },
          { name: "London, OH, USA", latitude: "39.88645", longitude: "-83.44825", score: 0.5 },
          { name: "London, KY, USA", latitude: "37.12898", longitude: "-84.08326", score: 0.5 },
          { name: "Londontowne, MD, USA", latitude: "38.93345", longitude: "-76.54941", score: 0.3 },
          { name: "London, ON, Canada", latitude: "42.98339", longitude: "-81.23304", score: 0.9 },
          { name: "London, OH, USA", latitude: "39.88645", longitude: "-83.44825", score: 0.5 },
          { name: "London, KY, USA", latitude: "37.12898", longitude: "-84.08326", score: 0.5 },
          { name: "Londontowne, MD, USA", latitude: "38.93345", longitude: "-76.54941", score: 0.3 },
          { name: "London, ON, Canada", latitude: "42.98339", longitude: "-81.23304", score: 0.9 },
          { name: "London, OH, USA", latitude: "39.88645", longitude: "-83.44825", score: 0.5 },
          { name: "London, KY, USA", latitude: "37.12898", longitude: "-84.08326", score: 0.5 },
          { name: "Londontowne, MD, USA", latitude: "38.93345", longitude: "-76.54941", score: 0.3 }
        ]

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