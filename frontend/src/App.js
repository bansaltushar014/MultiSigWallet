import React, { useState, useEffect, useRef } from 'react';
import logo from './logo.svg';
import './App.css';
import web3 from './helper.js';
import { FormControl, FormGroup, ControlLabel, HelpBlock, Checkbox, Radio, Row, Container, Col, Form, Button } from 'react-bootstrap';


const axios = require('axios');

function App() {

  const [address, setAddress] = useState('');
  const [noOfOwner, setnoOfOwner] = useState('');
  const [value, setValue] = useState('');
  const [transactionId, settransactionId] = useState('');
  const [balance, setbalance] = useState('');
  const [creator, setcreator] = useState('');


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
        getBalance();
        whoIsCreator();
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

  const SubmitAddress = async (e) => {
    e.preventDefault();
    console.log("Inside Form!");
    await metamaskAccount().then(account => {
      walletInstance.methods.addOwners(address).send({ from: account })
        .then(r => {
          console.log("Created Successfully!");
          noOfOwners();
        })
        .catch(e => {
          console.log(" Error is " + JSON.stringify(e));
        })
    });
  }

  const transfer = async (e) => {
    e.preventDefault();
    console.log("Inside 2 Form!");

    await metamaskAccount().then(account => {
      console.log("Account is " + account + "receiver address is " + address + " value is " + value);

      // walletInstance.methods.transferAmount(address, value).send({ from: account })
      walletInstance.methods.transferAmount(address, web3.utils.toWei(value)).send({ from: account })

        .then(r => {
          console.log("Created Successfully!");
          // noOfOwners();
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
        setcreator(r);
      })
      .catch(e => {
        console.log("Error is " + e);
      })
  }

  // take the value from the form, not hardcoded value
  const deposit = async (e) => {

    e.preventDefault();
    await metamaskAccount().then(account => {
      console.log("address is " + account);
      walletInstance.methods.deposit().send({
        from: account,
        value: web3.utils.toWei(value)
      })
        .then(r => {
          console.log("Deposit success " + r);
          getBalance();
        })
        .catch(e => {
          console.log("Error is " + JSON.stringify(e));
        })
    });
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

  const signTransaction = async (event) => {
    event.preventDefault();

    await metamaskAccount().then(account => {
      walletInstance.methods.signTransaction(transactionId).send({ from: account })
        .then(r => {
          console.log("Successfully signed " + JSON.stringify(r));
          getBalance();
        })
        .catch(e => {
          console.log("Error with " + JSON.stringify(e));
        })
    });
  }

  const transactionValue = (e) => {
    settransactionId(e.target.value);
  }

  const depositValue = (e) => {
    setValue(e.target.value);
  }

  const getBalance = () => {
    walletInstance.methods.walletBalance().call()
      .then(r => {
        console.log("balance is " + web3.utils.fromWei(r))
        setbalance(web3.utils.fromWei(r));
      })
  }

  return (
    <div>
      <br></br>
      <br></br>
      <Row>

        <Col sm={2}></Col>
        <Col sm={8}>

          <h6>Number of validOwners: {noOfOwner}</h6>
          <h6>Balance in the Contract: {balance} ether</h6>
          <h6>Creator is {creator}</h6>
          <br></br>

          <Form onSubmit={SubmitAddress}>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Create Owners</Form.Label>
              <br></br>
              <Form.Control onChange={AddressValue} type="text" placeholder="Enter address" />
              <Form.Text className="text-muted">
                Enter address to create more Owners.
          </Form.Text>
            </Form.Group>
            <Button variant="primary" type="submit">
              Submit
        </Button>
          </Form>

          <br></br>
          <hr></hr>
          <br></br>
          {/* <button onClick={deposit}>deposit</button> */}

          <Form onSubmit={deposit}>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Ether to deposit</Form.Label>
              <br></br>
              <Form.Control onChange={depositValue} type="text" placeholder="Ether" />
              <Form.Text className="text-muted">
                Enter the value to deposite in ether
          </Form.Text>
            </Form.Group>
            <Button variant="primary" type="submit">
              Submit
        </Button>
          </Form>

          <br></br>
          <hr></hr>
          <br></br>

          <Form onSubmit={transfer}>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Transfer || Create a transaction</Form.Label>
              <br></br>
              <Form.Control onChange={AddressValue} type="text" placeholder="Enter address" />
              <Form.Text className="text-muted">
                Enter address of Receiver.
          </Form.Text>
            </Form.Group>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Ether to be sent</Form.Label>
              <br></br>
              <Form.Control onChange={transferValue} type="text" placeholder="Enter value" />
              <Form.Text className="text-muted">
                Enter the value.
          </Form.Text>
            </Form.Group>
            <Button variant="primary" type="submit">
              Submit
        </Button>
          </Form>


          <br></br>
          <hr></hr>
          <br></br>

          <Form onSubmit={signTransaction}>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Sign the Transaction</Form.Label>
              <br></br>
              <Form.Control onChange={transactionValue} type="text" placeholder="Enter address" />
              <Form.Text className="text-muted">
                Enter Id to signTransaction
          </Form.Text>
            </Form.Group>
            <Button variant="primary" type="submit">
              Submit
        </Button>
          </Form>
          <br></br>
          <br></br>
        </Col>
        <Col sm={2}></Col>
      </Row>

    </div>
  );
}

export default App;
