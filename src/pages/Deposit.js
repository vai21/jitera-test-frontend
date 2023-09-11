import { useEffect, useState } from "react";
import axios from 'axios';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import './Product.css';
import { URL_DEPOSIT } from "../helpers/constants";


function Deposit() {
  const [amount, setAmount] = useState(0);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitFailed, setSubmitFailed] = useState(false);

  const submitData = async () => {
    try {
      const localSession = localStorage.getItem('session');
      await axios.post(URL_DEPOSIT, {
        balance: amount
      }, {
        headers: {
          'Authorization': `Bearer ${localSession}`
        }
      });
      setSubmitSuccess(true);
      setSubmitFailed(false);

      setTimeout(function() {
        window.location.href = '/';
      }, 500);
    } catch (err) {
      console.log(err);
      setSubmitSuccess(false);
      setSubmitFailed(true);
      if (err?.response?.status === 401) {
        window.location.href = '/logout';
      }
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
              <h3>Deposit</h3>
            </div>
            <div className="Product-text">
              <input className="form-control" placeholder="Amount in ($)" onChange={({target}) => setAmount(target.value)} />
            </div>
            <div className="Product-text">
              <Button type="submit" value={'Submit'} onClick={submitData} >Submit</Button>
            </div>
            {
              submitSuccess ? <div>Deposit Success</div>: ''
            }
            {
              submitFailed ? <div>Deposit Failed</div>: ''
            }
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Deposit;
