import { useEffect, useState } from "react";
import axios from 'axios';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import './Product.css';
import { URL_USER } from "../helpers/constants";


function Register() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitFailed, setSubmitFailed] = useState(false);

  const submitData = async () => {
    try {
      await axios.post(URL_USER, {
        name: fullName,
        username: email,
        password,
      });
      setSubmitSuccess(true);
      setSubmitFailed(false);

      setTimeout(function() {
        window.location.href = '/login';
      }, 2000);
    } catch (err) {
      console.log(err);
      setSubmitSuccess(false);
      setSubmitFailed(true);
    }
  }

  useEffect(() => {
  
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
              <input className="form-control" placeholder="Full Name" onChange={({target}) => setFullName(target.value)} />
            </div>
            <div className="Product-text">
              <input className="form-control" placeholder="Email" onChange={({target}) => setEmail(target.value)} />
            </div>
            <div className="Product-text">
              <input className="form-control" placeholder="Password" type="password" onChange={({target}) => setPassword(target.value)} />
            </div>
            <div className="Product-text">
              <Button type="submit" value={'Submit'} onClick={submitData} >Submit</Button>
            </div>
            {
              submitSuccess ? <div>Register Success</div>: ''
            }
            {
              submitFailed ? <div>Register Failed</div>: ''
            }
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Register;
