import React from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Header from './components/Header';
import LandingPage from './components/LandingPage';
import SearchPage from './components/SearchPage';
import Footer from './components/Footer';
import NotFoundPage from './components/NotFoundPage';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  return (
    <div className="App">
      <Header></Header>
      <div className="content-wrapper">
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<LandingPage></LandingPage>}></Route>
            <Route path='/search' element={<SearchPage></SearchPage>}></Route>
            <Route path='*' element={<NotFoundPage></NotFoundPage>}></Route>
          </Routes>
        </BrowserRouter>
      </div>
      <Footer></Footer>
    </div>
  );
}

export default App;
