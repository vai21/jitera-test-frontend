import { useEffect, useState } from "react";
import axios from 'axios';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import './Product.css';
import { currencyFormat } from "../helpers/currency";
import { URL_AUCTION, URL_AUCTION_PUBLISH, URL_BID } from "../helpers/constants";


function ListAuction() {
  const [listAuction, setListAuction] = useState([]);
  const [selectedAuctionId, setselectedAuctionId] = useState('');
  const [bidAmount, setBidAmount] = useState(0);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitFailed, setSubmitFailed] = useState(false);
  const [showBid, setShowBid] = useState(false);

  const closeBid = () => setShowBid(false);

  const getData = async () => {
    const localSession = localStorage.getItem('session');
    try {
      const response = await axios.get(URL_AUCTION, {
        headers: {
          Authorization: `Bearer ${localSession}`
        }
      });
      if (response?.data?.data?.length > 0) {
        setListAuction(response.data.data);
      }
    } catch (err) {
      if (err?.response?.status === 401) {
        window.location.href = '/logout';
      }
    }
  };

  const getDataCompleted = async () => {
    const localSession = localStorage.getItem('session');
    try {
      const response = await axios.get(URL_AUCTION, {
        headers: {
          Authorization: `Bearer ${localSession}`
        }
      });
      if (response?.data?.data?.length > 0) {
        setListAuction(response.data.data.filter(auction => auction.finish));
      }
    } catch (err) {
      if (err?.response?.status === 401) {
        window.location.href = '/logout';
      }
    }
  };

  const getDataInProgress = async () => {
    const localSession = localStorage.getItem('session');
    try {
      const response = await axios.get(URL_AUCTION, {
        headers: {
          Authorization: `Bearer ${localSession}`
        }
      });
      if (response?.data?.data?.length > 0) {
        setListAuction(response.data.data.filter(auction => auction.published && !auction.finish));
      }
    } catch (err) {
      if (err?.response?.status === 401) {
        window.location.href = '/logout';
      }
    }
  };

  const publishAuction = async (auctionId) => {
    const localSession = localStorage.getItem('session');
    try {
      await axios.post(URL_AUCTION_PUBLISH, {
        auctionId
      },
      {
        headers: {
          Authorization: `Bearer ${localSession}`
        }
      });
      await getData();
    } catch (err) {
      if (err?.response?.status === 401) {
        window.location.href = '/logout';
      }
    }
  }

  const openBid = (auctionId) => {
    setselectedAuctionId(auctionId);
    setShowBid(true);
  }

  const submitBid = async () => {
    try {
      const localSession = localStorage.getItem('session');
      await axios.post(URL_BID, {
        auctionId: selectedAuctionId,
        balance: bidAmount
      }, {
        headers: {
          'Authorization': `Bearer ${localSession}`
        }
      });
      setSubmitSuccess(true);
      getData();
    } catch(err) {
      setSubmitFailed(true);
    }
  }

  const filterByStatus = async (status) => {
    if (status === 'completed') {
      getDataCompleted();
    } else if (status === 'inProgress') {
      getDataInProgress();
    } else {
      getData();
    }
  }

  useEffect(() => {
    if (!localStorage.getItem('session')) {
      window.location.href = '/login';
    }
    getData();
  }, []);

  return (
    <>
      <Modal show={showBid} onHide={closeBid}>
        <Modal.Header closeButton={closeBid}>
          <Modal.Title>Create New Bid</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="Product-text">
            <input className="form-control" placeholder="Bid Amount" onChange={({target}) => setBidAmount(target.value)} />
          </div>
          <div className="Product-text">
            <Button type="submit" onClick={submitBid} >Submit Bid</Button>
          </div>
          <div className="Product-text">
            { submitSuccess ? 'Bidding Success' : '' }
            { submitFailed ? 'Bidding Failed': '' }
          </div>
        </Modal.Body>
      </Modal>
      <div className="Product-container">
        <Container fluid="md">
            <Row>
              <Col>
                <Form.Select onChange={({target}) => { filterByStatus(target.value); }}>
                  <option value=''>Choose Status</option>
                  <option value='completed'>Completed</option>
                  <option value='inProgress'>In Progress</option>
                </Form.Select>
              </Col>
            </Row>
            <Row>
              <Col>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>No.</th>
                      <th>Auction Item Name</th>
                      <th>Current Price</th>
                      <th>Duration</th>
                      <th>Option</th>
                    </tr>
                  </thead>
                  <tbody>
                    {listAuction.length > 0 ? listAuction.map(function (element, index) {
                      const remainingMinutes = parseInt((new Date() - new Date(element.finishDate)) / 1000 / 60, 10);
                      return ((
                        <tr key={index + 1}>
                          <td>{index + 1}</td>
                          <td>{element.name}</td>
                          <td>{element.currentPrice ? currencyFormat(element.currentPrice) : currencyFormat(element.startPrice)}</td>
                          <td>{!element.finish && remainingMinutes < 0 && element.published ? `${Math.abs(remainingMinutes)} minutes remaining` : 'Completed'}
                          {!element.published ? 'Not Yet Started' : ''}</td>
                          <td>
                            {element.published ? '' :
                              <Button onClick={() => { publishAuction(element._id) }}>Publish</Button>}
                            {element.published && !element.finish ?
                              <><Button onClick={() => { openBid(element._id) }}>Bid</Button> </> : 
                              ''}
                            {element.published && !element.finish && element.currentBidder ?
                              `Current Bidder: ${element.currentBidder}` :
                              ''}
                            {element.finish && element.currentBidder ?
                              `Auction Winner: ${element.currentBidder}` : 
                              ''}
                          </td>
                        </tr>
                      )
                      )
                    }) : null}
                  </tbody>
                </Table>
              </Col>
            </Row>
          </Container>
      </div>
    </>
  );
}

export default ListAuction;
