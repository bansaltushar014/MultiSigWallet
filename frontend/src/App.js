import React, { useState, useEffect, useRef } from 'react';
import logo from './logo.svg';
import './App.css';
import web3 from './helper.js';
import { FormControl, FormGroup, ControlLabel, HelpBlock, Checkbox, Radio, Form, Button } from 'react-bootstrap';


const axios = require('axios');

function App() {

  const [address, setAddress] = useState('');
  const [noOfOwner, setnoOfOwner] = useState('');
  const [value, setValue] = useState('');


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

        noOfOwners();
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  const metamaskAccount = () => {
    var promise = new Promise(function (resolve, reject) {
      web3.eth.getAccounts()
        .then(r => {
          console.log("first account is " + r[0]);
          resolve(r[0]);
        })
        .catch(e => {
          reject();
        })
    })

    return promise;

  }

  const AddressValue = (event) => {
    console.log(event.target.value);
    setAddress(event.target.value);
  }

  const transferValue = (event) => {
    console.log(event.target.value);
    setValue(event.target.value);
  }

  const SubmitAddress = (e) => {
    e.preventDefault();
    console.log("Inside Form!");
    walletInstance.methods.addOwners(address).send({ from: '0x38531219411157fC9Fe6Dd80449dc05f06903A9E' })
      .then(r => {
        console.log("Created Successfully!");
        noOfOwners();
      })
      .catch(e => {
        console.log(" Error is " + e);
      })
  }

  const transfer = async (e) => {
    e.preventDefault();
    console.log("Inside 2 Form!");

    await metamaskAccount().then(account => {
      console.log("Account is " + account + "receiver address is " + address + " value is "+value) ;

      walletInstance.methods.transferAmount(address, value).send({ from: account })
        .then(r => {
          console.log("Created Successfully!");
          noOfOwners();
        })
        .catch(e => {
          console.log(" Error is " + JSON.stringify(e));
        })
    })
  }

  const whoIsCreator = async () => {
    walletInstance.methods.creator().call()
      .then(r => {
        console.log("Creator is " + r);
      })
      .catch(e => {
        console.log("Error is " + e);
      })



  }

  const noOfOwners = () => {
    walletInstance.methods.noOfOwner().call()
      .then(r => {
        console.log("Number of Owners" + r);
        setnoOfOwner(r);
      })
      .catch(e => {
        console.log(e);
      })
  }



  return (
    <div>

      <Form onSubmit={SubmitAddress}>
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Address</Form.Label>
          <Form.Control onChange={AddressValue} type="text" placeholder="Enter address" />
          <Form.Text className="text-muted">
            Enter address of Owners.
          </Form.Text>
        </Form.Group>
        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>

      <button onClick={whoIsCreator}>Creator</button>

      <h3>count is {noOfOwner}</h3>
      <br></br>
      <br></br>
      <br></br>
      <br></br>

      <Form onSubmit={transfer}>
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Address</Form.Label>
          <Form.Control onChange={AddressValue} type="text" placeholder="Enter address" />
          <Form.Text className="text-muted">
            Enter address of Owners.
          </Form.Text>
        </Form.Group>
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Value</Form.Label>
          <Form.Control onChange={transferValue} type="text" placeholder="Enter value" />
          <Form.Text className="text-muted">
            Enter the value.
          </Form.Text>
        </Form.Group>
        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>

    </div>
  );
}

export default App;
