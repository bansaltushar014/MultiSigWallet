import React, { useState, useEffect, useRef } from 'react';
import logo from './logo.svg';
import './App.css';
import web3 from './helper.js';

const axios = require('axios');

function App() {
 
  var walletInstance = useRef(0);

  useEffect(() => {
    try {
      if (!web3.eth.net.isListening()) {
        console.log("Not connected");
      } else {
        console.log("connected");
        InitializeContract();
      }
    } catch (e) {
      console.log("Exception is " + JSON.stringify(e));
    }
  });

  const InitializeContract = () => {
    axios.get('http://localhost:4000/static/MultiSigWallet.json')
      .then(function (response) {
        // console.log(response.data);
        const walletAbi = response.data.abi;
        const walletContractAddress = response.data.networks[5777].address;
        walletInstance = new web3.eth.Contract(walletAbi, walletContractAddress);
        // console.log(walletInstance);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
