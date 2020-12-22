import React from 'react';
import {  Form, Button } from 'react-bootstrap';


const PendingTransaction = (props) => {

    const getTransaction = (e) => {
        e.preventDefault();
        props.setShowfun(true);
        
        const value = e.target.depositValue.value;
        console.log(value);
        
        e.target.reset();
        props.walletInstance.methods.getTransaction(value).call()
          .then(r => {
            props.setShowfun(false);
            console.log(r);
            alert(JSON.stringify(r));
          })
          .catch(e => {
            props.setShowfun(false);
            console.log(e);
          })
      }

      
    return ( <>
          <Form onSubmit={getTransaction}>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Pending Transaction at index</Form.Label>
              <br></br>
              <Form.Control name="depositValue" type="text" placeholder="Enter address" />
              <Form.Text className="text-muted">
                Enter valid Index of pendingTransaction
	            </Form.Text>
            </Form.Group>
            <Button variant="primary" type="submit">
              Submit
	          </Button>
          </Form>
    </> );
}
 
export default PendingTransaction;