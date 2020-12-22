import React from 'react';
import { Form, Button } from 'react-bootstrap';
import metamaskAccount from './metamask';

const CreateOwners = (props) => {

  // To add more validators
  const CreateOwnersfun = async (e) => {
    e.preventDefault();
    console.log("Inside Form!");
    const address = e.target.NewOwnerAddress.value;
    e.target.reset();
        
    await metamaskAccount().then(account => {  
      props.setShowfun(true);
      props.walletInstance.methods.addOwners(address).send({ from: account, gas: 300000 })
        .then(r => {
          props.setShowfun(false);
          console.log("Created Successfully!");
          props.noOfOwners();
        })
        .catch(e => {
          props.setShowfun(false);
          console.log(" Error is " + JSON.stringify(e));
        })
    });
    
  }

    return ( <>
         <Form onSubmit={CreateOwnersfun}>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Create Owners</Form.Label>
              <br></br>
              <Form.Control name="NewOwnerAddress" type="text" placeholder="Enter address" />
              <Form.Text className="text-muted">
                Enter address to create more Owners.
	               </Form.Text>
            </Form.Group>
            <Button variant="primary" type="submit">
                Submit
	        </Button>
          </Form>
    </> );
}
 
export default CreateOwners;