import React from 'react';
import { Form, Button } from 'react-bootstrap';
import metamaskAccount from './metamask';
import web3 from '../helper';

const EtherDeposit = (props) => {

  // Deposit the amount to smart contract
  const deposit = async (e) => {
    console.log("Inside Deposit!");
    
    e.preventDefault();
    const value = e.target.depositValue.value;
    e.target.reset();
    
    await metamaskAccount().then(account => {
      props.setShowfun(true);
      console.log("address is " + account);
      props.walletInstance.methods.deposit().send({
        from: account,
        value: web3.utils.toWei(value),
        gas: 300000
      })
        .then(r => {
          props.setShowfun(false);
          console.log("Deposit success " + JSON.stringify(r));
          props.getBalance();
        })
        .catch(e => {
          props.setShowfun(false);
          console.log("Error is " + JSON.stringify(e));
        })
    });
  }


    return ( <>
          <Form onSubmit={deposit}>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Ether to deposit</Form.Label>
              <br></br>
              <Form.Control name="depositValue" type="text" placeholder="Ether" />
              <Form.Text className="text-muted">
                Enter the value to deposite in ether
	            </Form.Text>
            </Form.Group>
            <Button variant="primary" type="submit">
              Submit
	        </Button>
          </Form>
    </> );
}
 
export default EtherDeposit;