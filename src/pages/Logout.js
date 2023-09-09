import { useEffect } from "react";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import './Product.css';


function Logout() {
  const redirectToHome = () => {
    localStorage.removeItem('session');
    setTimeout(function() {
      window.location.href = '/login';
    }, 2000)
  };

  useEffect(() => {
    redirectToHome();
  
  }, []);

  return (
    <div className="Product-container">
      <Container fluid="md">
        <Row>
          <Col className="Product-item">
            <div className="Product-item">
              <h3>Redirecting to homepage...</h3>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Logout;
