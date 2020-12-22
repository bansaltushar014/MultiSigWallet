import React, { useState } from 'react';
import { Modal, Button} from 'react-bootstrap';

function OwnerListModal(props) {
    const [show, setShow] = useState(false);
    const [addedOwners, setaddedOwners] = useState(0);

    const handleClose = () => setShow(false);
    const handleShow = () => {
      setShow(true)
      getValidOwnersList();
    };

    // Get the list of valid Owners // Throwing error
  const getValidOwnersList = () => {
      console.log("Inside getValidOwnersList");
      props.walletInstance.methods.getAddedOwners().call()
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

    return (
      <>
        <Button variant="primary" onClick={handleShow}>
          Get Added Owners
        </Button>

        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>List of Added Owners</Modal.Title>
          </Modal.Header>
          <Modal.Body>

            {addedOwners &&
              props.addedOwners.map((item,i) => <li key={i}>{item}</li>)
            }

          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }

//   render(<OwnerListModal />);

export default OwnerListModal;
