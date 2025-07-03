import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from './firebase';

import Navbar from './Navbar';
import AddProblem from './AddProblem';
import Problems from './problems'; 
import About from './About';
import EditProblem from './EditProblem';


function Home() {
  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold text-green-600">Welcome to Your Tracker 🚀</h1>
      <p className="mt-4 text-lg text-gray-700">Start adding problems you’ve solved and show your journey.</p>
    </div>
  );
}



function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/problems" element={<Problems />} />
        <Route path="/add" element={<AddProblem />} />
        <Route path="/about" element={<About />} />
        <Route path="/edit/:id" element={<EditProblem />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
