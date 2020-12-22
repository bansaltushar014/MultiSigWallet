import React from 'react';
import { Form, Button } from 'react-bootstrap';
import metamaskAccount from './metamask';

const SignTransaction = (props) => {

    const signTransaction = async (event) => {
        event.preventDefault();
        const transactionId = event.target.transactionValue.value;
        await metamaskAccount().then(account => {
          props.setShowfun(true);
          props.walletInstance.methods.signTransaction(transactionId).send({ from: account, gas: 300000 })
            .then(r => {
              props.setShowfun(false);
              console.log("Successfully signed " + JSON.stringify(r));
              props.getBalance();
              props.pendingTransactions();
            })
            .catch(e => {
              props.setShowfun(false);
              console.log("Error with " + JSON.stringify(e));
            })
        });
      }


    return ( <>
        <Form onSubmit={signTransaction}>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Sign the Transaction</Form.Label>
              <br></br>
              <Form.Control name="transactionValue" type="text" placeholder="Enter address" />
              <Form.Text className="text-muted">
                Enter Id to signTransaction
	            </Form.Text>
            </Form.Group>
            <Button variant="primary" type="submit">
              Submit
	          </Button>
          </Form>
    </> );
}
 
export default SignTransaction;