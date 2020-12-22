import React, { useState, useEffect, useRef,  Suspense, lazy  } from 'react';
import './App.css';
import web3 from './helper.js';
import OwnerListModal from './components/ownersListModal';
import HeaderInfo from './components/headerInfo';
import CreateOwners from './components/createOwners';
import EtherDeposit from './components/etherDeposit';
import RemoveOwner from './components/removeOwner';
import CreateTransaction from './components/createTransaction';
import SignTransaction from './components/signTransaction';
import PendingTransaction from './components/pendingTransaction';
import { FormControl,
  FormGroup,
  ControlLabel,
  Modal,
  Spinner,
  HelpBlock,
  Checkbox,
  Radio,
  Row,
  Container,
  Col,
  Form,
  Button,
  ThemeProvider } from 'react-bootstrap';


const axios = require('axios');

function App() {

  const [noOfOwner, setnoOfOwner] = useState('');
  const [balance, setbalance] = useState(''); // to get the balance
  const [creator, setcreator] = useState('');
  const [pendingtrans, setpendingtrans] = useState('');
  const [show, setshow] = useState(false);  // to show the modal
  const [walletInstance, setwalletInstance] = useState(0);
  
  const handleClose = () => setshow(false);

  const doNothing = () => { }; // Modal onHide do nothing.

  useEffect(() => {
    try {

      if (!web3.eth.net.isListening()) {
        console.log("Web3 Not connected");
      } else {
        console.log("Web3 connected");
        InitializeContract();
      }
    } catch (e) {
      console.log("Exception is " + JSON.stringify(e));
    }
  },[]);

  
  // Initialize te contract
  const InitializeContract = () => {
    axios.get('http://localhost:4000/static/MultiSigWallet.json')
      .then(function (response) {
        const walletAbi = response.data.abi;

        // Ropsten Network
        // const walletContractAddress = response.data.networks[3].address;
        
        // Ganache 
        const walletContractAddress = response.data.networks[5777].address;
        const instance = new web3.eth.Contract(walletAbi, walletContractAddress);
        setwalletInstance(instance);
      })
      
      .catch(function (error) {
        console.log(error);
      });
  }

  useEffect(() => {
     if(walletInstance != 0){
      noOfOwners();
      getBalance();
      whoIsCreator();
      pendingTransactions();
     }
  },[walletInstance]);
  
  const noOfOwners = async () => {
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

  const getBalance = () => {
    walletInstance.methods.walletBalance().call()
      .then(res => {
        console.log("balance is " + web3.utils.fromWei(res))
        setbalance(web3.utils.fromWei(res));
      })
      .catch(e => {
        setshow(false);
        console.log(e);
      })
  }

  const whoIsCreator = async () => {
    console.log("inside whoIsCreator!");
    walletInstance.methods.creator().call()
      .then(r => {
        console.log("Creator is " + r);
        setcreator(r);
      })
      .catch(e => {
        console.log("Error is " + e);
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

    const setShowfun = (boolValue) => {
      setshow(boolValue)
    }

  return (
    <div>

      <br></br><br></br>
      <Row>
        <Col sm={2}></Col>
        <Col sm={8}>
          
          <HeaderInfo 
            noOfOwner = {noOfOwner}
            balance = {balance}
            creator = {creator}
            pendingtrans = {pendingtrans}
          />
          <br></br>

          <OwnerListModal
             walletInstance = {walletInstance}
          />
          
          <br></br><br></br><br></br>

          <CreateOwners 
          setShowfun = {setShowfun} 
          walletInstance = {walletInstance}
          noOfOwners = {noOfOwners}
          />

          <br></br><hr></hr><br></br>

          <EtherDeposit 
          setShowfun = {setShowfun} 
          walletInstance = {walletInstance}
          getBalance = {getBalance}
          />

          <br></br><hr></hr><br></br>

          <RemoveOwner 
            setShowfun = {setShowfun} 
            walletInstance = {walletInstance}
          />
          <br></br><hr></hr><br></br>

          <CreateTransaction 
            setShowfun = {setShowfun} 
            walletInstance = {walletInstance}
            pendingTransactions = {pendingTransactions}
          />


          <br></br><hr></hr><br></br>

          <SignTransaction
           setShowfun = {setShowfun} 
           walletInstance = {walletInstance}
           getBalance = {getBalance}
           pendingTransactions = {pendingTransactions}
          />

          <br></br><hr></hr><br></br>

          <PendingTransaction 
            setShowfun = {setShowfun} 
            walletInstance = {walletInstance}
          />

          <br></br><br></br>

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
