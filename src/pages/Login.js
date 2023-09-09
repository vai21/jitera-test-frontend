import { useEffect, useState } from "react";
import axios from 'axios';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import './Product.css';
import { URL_LOGIN } from "../helpers/constants";


function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitFailed, setSubmitFailed] = useState(false);

  const submitData = async () => {
    try {
      const login = await axios.post(URL_LOGIN, {
        username: email,
        password,
      });

      localStorage.setItem('session', login.data.data);
      setSubmitSuccess(true);
      setSubmitFailed(false);

      setTimeout(function() {
        window.location.href = '/';
      }, 500);
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
              <h3>Login</h3>
            </div>
            <div className="Product-text">
              <input className="form-control" placeholder="Username (Email)" onChange={({target}) => setEmail(target.value)} />
            </div>
            <div className="Product-text">
              <input className="form-control" placeholder="Password" type="password" onChange={({target}) => setPassword(target.value)} />
            </div>
            <div className="Product-text">
              <Button type="submit" value={'Submit'} onClick={submitData} >Submit</Button>
            </div>
            {
              submitSuccess ? <div>Login Success</div>: ''
            }
            {
              submitFailed ? <div>Login Failed</div>: ''
            }
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Login;
