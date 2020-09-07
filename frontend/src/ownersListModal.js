import React, { useState, useEffect, useRef } from 'react';
import { FormControl, FormGroup, ControlLabel, Modal, Spinner, HelpBlock, Checkbox, Radio, Row, Container, Col, Form, Button, ThemeProvider } from 'react-bootstrap';

function OwnerListModal(props) {
    const [show, setShow] = useState(false);
  
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    useEffect(() => {
        console.log(props)
    })
  
    return (
      <>
        <Button variant="primary" onClick={handleShow}>
          Get Added Owners
        </Button>
  
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Modal heading</Modal.Title>
          </Modal.Header>
          <Modal.Body>

            {props.data.map((item,i) => <li key={i}>{item}</li>)}

          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={handleClose}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
  
//   render(<OwnerListModal />);

export default OwnerListModal;