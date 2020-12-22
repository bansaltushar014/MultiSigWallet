import React from 'react';
import { Form, Button } from 'react-bootstrap';
import metamaskAccount from './metamask';
import web3 from '../helper';

const CreateTransaction = (props) => {
    const transfer = async (e) => {
        e.preventDefault();

        const address = e.target.receiverAddress.value;
        const value = e.target.receiveAmount.value;

        e.target.reset();
        console.log("Inside 2 Form!");
        await metamaskAccount().then(account => {
          props.setShowfun(true);
          console.log("Account is " + account + "receiver address is " + address + " value is " + value);
          props.walletInstance.methods.transferAmount(address, web3.utils.toWei(value)).send({ from: account, gas: 300000 })
            .then(r => {
              props.setShowfun(false);
              console.log("Created Successfully!");
              props.pendingTransactions();
            })
            .catch(e => {
              console.log(" Error is " + JSON.stringify(e));
            })
        })
      }


    return ( <> 
        <Form onSubmit={transfer}>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Transfer || Create a transaction</Form.Label>
              <br></br>
              <Form.Control name="receiverAddress" type="text" placeholder="Enter address" />
              <Form.Text className="text-muted">
                Enter address of Receiver.
	            </Form.Text>
            </Form.Group>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Ether to be sent</Form.Label>
              <br></br>
              <Form.Control name="receiveAmount" type="text" placeholder="Enter value" />
              <Form.Text className="text-muted">
                Enter the value.
	            </Form.Text>
            </Form.Group>
            <Button variant="primary" type="submit">
              Submit
	          </Button>
          </Form>
    </>);
}
 
export default CreateTransaction;