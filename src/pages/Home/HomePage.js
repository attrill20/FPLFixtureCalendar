import React from 'react';
import "./HomePage.css"
import { Link } from 'react-router-dom';

const HomePage= () => {
  return (
    <div>
    <header className="app-header">
        <h1>Hello, welcome to my home page!</h1>
      </header>
      <div className="sub-heading">
        <h3>
         This is the site!
        </h3> 
      </div>
    </div>
  );
};

export default HomePage;