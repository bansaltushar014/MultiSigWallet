import React from 'react';
import {  Form, Button} from 'react-bootstrap';
import metamaskAccount from './metamask';

const RemoveOwner = (props) => {

    // To remove the added owners
  const remove = async (e) => {
    props.setShowfun(true);
    console.log("Inside Remove!");
    const address = e.target.AddressToRemove.value;
    e.preventDefault();
    e.target.reset();
    await metamaskAccount().then(account => {
      console.log(account);
      props.walletInstance.methods.removeOwner(address).send({ from: account, gas: 300000 })
        .then(r => {
          props.setShowfun(false);
          console.log(r);
          // alert(JSON.stringify(r));
        })
        .catch(e => {
          props.setShowfun(false);
          console.log(e);
        })
    });
  }


    return ( <>
      <Form onSubmit={remove}>
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Address to Remove as owner</Form.Label>
          <br></br>
          <Form.Control name="AddressToRemove" type="text" placeholder="Address to Remove" />
          <Form.Text className="text-muted">
            Enter the address to remove.
        </Form.Text>
        </Form.Group>
        <Button variant="primary" type="submit">
          Submit
      </Button>
      </Form>
    </> );
}
 
export default RemoveOwner;