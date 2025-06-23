import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Game from './pages/Game';

const App = () => 
(
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/game/:mode" element={<Game />} />
  </Routes>
);

export default App;
