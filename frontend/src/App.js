import React, { useState, useEffect, useRef } from 'react';
import logo from './logo.svg';
import './App.css';
import web3 from './helper.js';
import { FormControl, FormGroup, ControlLabel, Modal, Spinner, HelpBlock, Checkbox, Radio, Row, Container, Col, Form, Button, ThemeProvider } from 'react-bootstrap';
import OwnerListModal from './ownersListModal';

const axios = require('axios');

function App() {

  const [address, setAddress] = useState('');
  const [noOfOwner, setnoOfOwner] = useState('');
  const [value, setValue] = useState('');
  const [transactionId, settransactionId] = useState('');
  const [balance, setbalance] = useState(''); // to get the balance
  const [creator, setcreator] = useState('');
  const [pendingtrans, setpendingtrans] = useState('');
  const [show, setshow] = useState(false);  // to show the modal
  const [addedOwners, setaddedOwners] = useState([]);
  const [tryaddedOwners, settryaddedOwners] = useState(["one", "two"]);

  var walletInstance = useRef(0);

  const handleClose = () => setshow(false);

  const doNothing = () => { }; // Modal onHide do nothing.

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

  // Initialize te contract
  const InitializeContract = () => {
    // debugger;
    // setshow(true);
    axios.get('http://localhost:4000/static/MultiSigWallet.json')
      .then(function (response) {
        // setshow(false);
        const walletAbi = response.data.abi;
        const walletContractAddress = response.data.networks[5777].address;
        walletInstance = new web3.eth.Contract(walletAbi, walletContractAddress);
        noOfOwners();
        // getValidOwnersList();
        getBalance();
        whoIsCreator();
        pendingTransactions();

      })
      .catch(function (error) {
        // setshow(false);
        console.log(error);
      });
  }

  // To retrieve Active account in metamask
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

  // To add more validators
  const CreateOwners = async (e) => {
    e.preventDefault();
    e.target.reset();
    console.log("Inside Form!");
    await metamaskAccount().then(account => {
      setshow(true);
      walletInstance.methods.addOwners(address).send({ from: account, gas: 300000 })
        .then(r => {
          setshow(false);
          console.log("Created Successfully!");
          noOfOwners();
        })
        .catch(e => {
          setshow(false);
          console.log(" Error is " + JSON.stringify(e));
        })
    });
  }


  const transfer = async (e) => {
    e.preventDefault();
    e.target.reset();
    console.log("Inside 2 Form!");
    await metamaskAccount().then(account => {
      setshow(true);
      console.log("Account is " + account + "receiver address is " + address + " value is " + value);
      walletInstance.methods.transferAmount(address, web3.utils.toWei(value)).send({ from: account, gas: 300000 })
        .then(r => {
          setshow(false);
          console.log("Created Successfully!");
          pendingTransactions();
        })
        .catch(e => {
          console.log(" Error is " + JSON.stringify(e));
        })
    })
  }

  const whoIsCreator = async () => {
    console.log("inside whoIsCreator!");
    walletInstance.methods.creator().call()
      .then(r => {
        // setshow(false);
        console.log("Creator is " + r);
        setcreator(r);
      })
      .catch(e => {
        console.log("Error is " + e);
      })
  }

  // Deposit the amount to smart contract
  const deposit = async (e) => {
    // debugger;
    console.log("Inside Deposit!");
    console.log(walletInstance);
    e.preventDefault();
    e.target.reset();
    await metamaskAccount().then(account => {
      setshow(true);
      console.log("address is " + account);
      walletInstance.methods.deposit().send({
        from: account,
        value: web3.utils.toWei(value),
        gas: 300000
      })
        .then(r => {
          setshow(false);
          console.log("Deposit success " + JSON.stringify(r));
          getBalance();
        })
        .catch(e => {
          setshow(false);
          console.log("Error is " + JSON.stringify(e));
        })
    });
  }

  // To know the number of valid owners
  const noOfOwners = () => {
    console.log("Inside noOfOwners!");
    walletInstance.methods.noOfOwner().call()
      .then(r => {
        console.log("Number of Owners" + r);
        setnoOfOwner(r);
      })
      .catch(e => {
        setshow(false);
        console.log(e);
      })
  }

  const signTransaction = async (event) => {
    event.preventDefault();

    await metamaskAccount().then(account => {
      setshow(true);
      walletInstance.methods.signTransaction(transactionId).send({ from: account, gas: 300000 })
        .then(r => {
          setshow(false);
          console.log("Successfully signed " + JSON.stringify(r));
          getBalance();
          pendingTransactions();
        })
        .catch(e => {
          setshow(false);
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
    // setshow(true);
    console.log("inside getBalance");
    walletInstance.methods.walletBalance().call()
      .then(r => {
        // setshow(false);
        console.log("balance is " + web3.utils.fromWei(r))
        setbalance(web3.utils.fromWei(r));
      })
      .catch(e => {
        setshow(false);
        console.log(e);
      })
  }

  const pendingTransactions = () => {
    console.log("Inside pendingTransactions!");
    walletInstance.methods.getPendingTransaction().call()
      .then(result => {
        setpendingtrans(JSON.stringify(result));
      })
      .catch(e => {
        setshow(false);
        console.log(e);
      })
  }

  const getTransaction = (e) => {
    // debugger;
    setshow(true);
    e.preventDefault();
    e.target.reset();
    walletInstance.methods.getTransaction(value).call()
      .then(r => {
        setshow(false);
        console.log(r);
        alert(JSON.stringify(r));
      })
      .catch(e => {
        setshow(false);
        console.log(e);
      })
  }

  // To remove the added owners
  const remove = async (e) => {
    setshow(true);
    console.log("Inside Remove!");
    e.preventDefault();
    e.target.reset();
    await metamaskAccount().then(account => {
      walletInstance.methods.removeOwner(address).send({ from: account, gas: 300000 })
        .then(r => {
          setshow(false);
          console.log(r);
          // alert(JSON.stringify(r));
        })
        .catch(e => {
          setshow(false);
          console.log(e);
        })
    });
  }

  // Get the list of valid Owners // Throwing error
  const getValidOwnersList = () => {
    console.log("Inside getValidOwnersList");
    walletInstance.methods.getAddedOwners().call()
      .then(r => {
        console.log(r);
        setaddedOwners(r);
        // alert(r);
        console.log("ValidOwners Are " + JSON.stringify(r));
      })
      .catch(e => {
        console.log(e);
      })
  }

  const testvalue = () => {
    console.log(addedOwners);
    console.log(tryaddedOwners);
  }

  return (
    <div>

      <br></br><br></br>
      <Row>
        <Col sm={2}></Col>
        <Col sm={8}>
          <h6>Number of validOwners: {noOfOwner}</h6>
          <h6>Balance in the Contract: {balance} ether</h6>
          <h6>Creator is {creator}</h6>
          {pendingtrans.length > 0 &&
            <h6>Pending Transactions are at index {pendingtrans}</h6>
          }
          <br></br>
          <div onClick={getValidOwnersList}>
            <OwnerListModal data={addedOwners} />
          </div>
          {/*<button onClick={getValidOwnersList}>OwnerList</button>*/}

          <br></br>
          <br></br>
          <br></br>

          <Form onSubmit={CreateOwners}>
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

          <Form onSubmit={remove}>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Address to Remove as owner</Form.Label>
              <br></br>
              <Form.Control onChange={AddressValue} type="text" placeholder="Address to Remove" />
              <Form.Text className="text-muted">
                Enter the address to remove.
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
          <hr></hr>
          <br></br>
          <Form onSubmit={getTransaction}>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Pending Transaction at index</Form.Label>
              <br></br>
              <Form.Control onChange={depositValue} type="text" placeholder="Enter address" />
              <Form.Text className="text-muted">
                Enter valid Index of pendingTransaction
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

      <Modal show={show} onHide={doNothing}>
        <Modal.Body>
          <Spinner animation="border" /> &nbsp;&nbsp;
		Waiting for the transaction!
	  </Modal.Body>
      </Modal>
    </div>
  );
}

export default App;
