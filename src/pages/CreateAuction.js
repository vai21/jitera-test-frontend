import { useEffect, useState } from "react";
import axios from 'axios';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import './Product.css';
import { URL_AUCTION } from "../helpers/constants";


function CreateAuction() {
  const [itemName, setItemName] = useState('');
  const [startPrice, setStartPrice] = useState(0);
  const [timeWindow, setTimeWindow] = useState(0);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitFailed, setSubmitFailed] = useState(false);

  const submitData = async () => {
    try {
      const localSession = localStorage.getItem('session');
      await axios.post(URL_AUCTION, {
        name: itemName,
        startPrice,
        timeWindow,
      }, {
        headers: {
          'Authorization': `Bearer ${localSession}`
        }
      });
      setSubmitSuccess(true);
      setSubmitFailed(false);

      setTimeout(function() {
        window.location.href = '/';
      }, 2000);
    } catch (err) {
      console.log(err);
      setSubmitSuccess(false);
      setSubmitFailed(true);
    }
  }

  useEffect(() => {
    if (!localStorage.getItem('session')) {
      window.location.href = '/login';
    }
  }, []);

  return (
    <div className="Product-container">
      <Container fluid="md">
        <Row>
          <Col className="Product-item">
            <div className="Product-item">
              <h3>Register</h3>
            </div>
            <div className="Product-text">
              <input className="form-control" placeholder="Item Name" onChange={({target}) => setItemName(target.value)} />
            </div>
            <div className="Product-text">
              <input className="form-control" placeholder="Starting Price in ($)" onChange={({target}) => setStartPrice(target.value)} />
            </div>
            <div className="Product-text">
              <input className="form-control" placeholder="Time window in (hour(s))" onChange={({target}) => setTimeWindow(target.value)} />
            </div>
            <div className="Product-text">
              <Button type="submit" value={'Submit'} onClick={submitData} >Submit</Button>
            </div>
            {
              submitSuccess ? <div>Create Auction Item Success</div>: ''
            }
            {
              submitFailed ? <div>Create Auction Item Failed</div>: ''
            }
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default CreateAuction;
