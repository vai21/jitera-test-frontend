import { useEffect, useState } from 'react';
import axios from 'axios';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Offcanvas from 'react-bootstrap/Offcanvas';
import './Navbar.css';
import Logo from './logo.svg'
import { URL_USER } from './helpers/constants';


function NavbarBootstrap() {
  const [session, setSession] = useState(''); 
  const [fullName, setFullName] = useState('');
  const [balance, setBalance] = useState('');

  const getUser = async() => {
    const localSession = localStorage.getItem('session');
    try {
      const user = await axios.get(URL_USER, {
        headers: {
          'Authorization': `Bearer ${localSession}`
        }
      });
      setFullName(user.data.data.name);
      setBalance(user?.data?.data?.balance);
    } catch (err) {
      if (err.response.status === 401) {
        localStorage.removeItem('session');
      }
    }
  }

  useEffect(() => {
    setSession(localStorage.getItem('session'));
    getUser();
    // eslint-disable-next-line
  }, []);

  return (
    <>
      {[false].map((expand) => (
        <Navbar key={expand} expand={expand} className="bg-body-tertiary mb-3">
          <Container fluid>
            <Navbar.Brand href="#"><img src={Logo} alt='logo' />Auction</Navbar.Brand>
            <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-${expand}`} />
            <Navbar.Offcanvas
              id={`offcanvasNavbar-expand-${expand}`}
              aria-labelledby={`offcanvasNavbarLabel-expand-${expand}`}
              placement="end"
            >
              <Offcanvas.Header closeButton>
                <Offcanvas.Title id={`offcanvasNavbarLabel-expand-${expand}`}>
                  <Nav>
                    { session ? <><div>{fullName}</div> <div>Balance: ${parseFloat(balance).toFixed(1) || 0}</div></> : <Nav.Link href="/login">Login</Nav.Link>}
                  </Nav>
                </Offcanvas.Title>
              </Offcanvas.Header>
              <Offcanvas.Body>
                <Nav className="justify-content-end flex-grow-1 pe-3">
                  { session ? <></> : <Nav.Link href="/register">Register</Nav.Link>}
                  { session ? <Nav.Link href="/auction">Create New Auction</Nav.Link> : <></> }
                  { session ? <Nav.Link href="/deposit">Deposit</Nav.Link> : <></> }
                  { session ? <Nav.Link href="/logout">Logout</Nav.Link> : <></> }
                </Nav>
              </Offcanvas.Body>
            </Navbar.Offcanvas>
          </Container>
        </Navbar>
      ))}
    </>
  );
}


export default NavbarBootstrap;
