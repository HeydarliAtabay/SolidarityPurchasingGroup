import { Button, Row, Col, Container, Alert } from 'react-bootstrap';
import { useState } from 'react';
import API from '../API';
import dayjs from 'dayjs';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

var weekday = require('dayjs/plugin/weekday');
dayjs.extend(weekday);

dayjs.Ls.en.weekStart = 1;

function Basket(props) {
  const [mailerState, setMailerState] = useState({
    email: '',
    message: '',
  });
  const [emailSent, setEmailSent] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const handleSubmitEmail = (event) => {
    API.submitEmail(mailerState).then(() => {
      setEmailSent(true);
      setOpenDialog(false);
    });
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  function changeEmailState(client) {
    setMailerState((prevState) => ({
      ...prevState,
      email: client.email,
      message: `Dear ${client.name} ${client.surname}, 
Your order from Solidarity Purchase group was confirmed, You will be informed when your products will be ready to deliver

Best Regards,
Solidarity Purchase Group
`,
    }));
  }

  return (
    <>
      <h2 className="text-center">Basket: </h2>
      {props.productsBasket.length === 0 && (
        <div className="text-center">Cart is Empty</div>
      )}
      {props.productsBasket.map((item) => (
        <Container key={item.id} className="text-center">
          <Row className="pt-3 my-auto">
            <Col md="4">
              <div>{props.capitalizeFirstLetter(item.name)}</div>
            </Col>
            <Col>
              <Button
                variant="success"
                width="16"
                onClick={() => props.onAdd(item, 0.5)}
                className="roundbox-t"
                style={{ borderRadius: '25px' }}
              >
                +
              </Button>
            </Col>
            <Col>
              {' '}
              <Button
                variant="danger"
                width="16"
                onClick={() => props.onRemove(item, 0.5)}
                style={{ borderRadius: '25px' }}
              >
                -
              </Button>{' '}
            </Col>
            <Col>
              {item.qty}
              {item.unit} x €{item.price.toFixed(2)}
            </Col>
          </Row>
        </Container>
      ))}
      {props.productsBasket.length > 0 && (
        <>
          <Row>
            <Col align="center" className="mb-3 mt-2">
              Total: €{props.itemsPrice.toFixed(2)}
            </Col>
          </Row>
          <Row className="justify-content-between align-items-center mb-4">
            <Col>
              <span>Delivery data</span>
            </Col>
            <Col>
              <Button
                variant="outline-primary"
                onClick={() => props.setShowCompletePurchase(true)}
                style={{ borderRadius: '25px' }}
              >
                Insert
              </Button>
            </Col>
          </Row>

          {props.deliveryFlag === 'delivery' &&
          props.address !== '' &&
          props.nation !== '' &&
          props.city !== '' &&
          props.zipCode !== '' &&
          props.date !== '' &&
          props.time !== '' ? (
            <>
              <Container fluid>
                <Row>
                  <h5 className="d-block text-center">Delivery at home</h5>
                  <span>Address: {props.address}</span>
                  <span>Nation: {props.nation}</span>
                  <span>City: {props.city}</span>
                  <span>ZipCode: {props.zipCode}</span>
                  <span>Date: {props.date}</span>
                  <span>Time: {props.time}</span>
                </Row>
              </Container>
              <Row>
                {props.clients
                  .filter((x) => x.client_id === parseInt(props.clientid))
                  .map((s) => (
                    <>
                      <Button
                        onClick={() => {
                          props.onConfirm();
                          changeEmailState(s);
                          handleOpenDialog();
                          setEmailSent(true);
                        }}
                        className="mt-3"
                        style={{ borderRadius: '25px' }}
                      >
                        Confirm
                      </Button>{' '}
                      {emailSent && (
                        <>
                          <Button
                            variant="secondary"
                            style={{ borderRadius: '25px' }}
                            onClick={() => {
                              setMailerState((prevState) => ({
                                ...prevState,
                                email: s.email,
                                message: `Dear ${s.name} ${s.surname}, Your order from Solidarity Purchase group was confirmed, You will be informed when your products will be ready to deliver
                  `,
                              }));
                              handleSubmitEmail();
                              setEmailSent(true);
                            }}
                            className="mt-3"
                          >
                            Resend Email
                          </Button>{' '}
                        </>
                      )}
                    </>
                  ))}
              </Row>
            </>
          ) : (
            <></>
          )}

          {props.deliveryFlag !== 'delivery' &&
          (props.pickupDay === 2 ||
            props.pickupDay === 3 ||
            props.pickupDay === 4) &&
          props.pickupTime !== '' ? (
            <>
              <Container fluid>
                <Row>
                  <h5 className="d-block text-center">Pickup in shop</h5>
                  {props.flag ? (
                    <span>
                      <b>Date</b>:{' '}
                      {dayjs(props.date).format('dddd, MMMM D, YYYY')}
                    </span>
                  ) : (
                    <span>
                      <b>Date</b>:{' '}
                      {dayjs(props.time.date)
                        .add(1, 'week')
                        .weekday(props.pickupDay)
                        .format('dddd, MMMM D, YYYY')}
                    </span>
                  )}
                  <span>
                    <b>Time</b>: {props.pickupTime}
                  </span>
                </Row>
              </Container>
              <Row>
                {props.clients
                  .filter((x) => x.client_id === parseInt(props.clientid))
                  .map((s) => (
                    <>
                      <Button
                        onClick={() => {
                          props.onConfirm();
                          setMailerState((prevState) => ({
                            ...prevState,
                            email: s.email,
                            message: `Dear ${s.name} ${s.surname}, Your order from Solidarity Purchase group was confirmed, You will be informed when your products will be ready to be picked up from the shop
                  `,
                          }));
                          handleSubmitEmail();
                          setEmailSent(true);
                        }}
                        style={{ borderRadius: '25px' }}
                        className="mt-3"
                      >
                        Confirm
                      </Button>{' '}
                      {emailSent && (
                        <>
                          <Button
                            variant="secondary"
                            style={{ borderRadius: '25px' }}
                            onClick={() => {
                              setMailerState((prevState1) => ({
                                ...prevState1,
                                email: s.email,
                                message: `Dear ${s.name} ${s.surname}, 
                                
Your order from Solidarity Purchase group was confirmed, You will be informed when your products will be ready to be picked up from the shop.

Best Regards,
Solidarity Purchase Group
                  `,
                              }));
                              handleSubmitEmail();
                              setEmailSent(true);
                            }}
                            className="mt-3"
                          >
                            Resend Email
                          </Button>{' '}
                        </>
                      )}
                    </>
                  ))}
              </Row>
            </>
          ) : (
            <></>
          )}
          <Row>
            <Alert className="m-3" show={props.showsuccess} variant="success">
              <Alert.Heading>Order success</Alert.Heading>
              <hr />
              <div className="d-flex justify-content-end">
                <Button
                  style={{ borderRadius: '25px' }}
                  onClick={() => props.setShowsuccess(false)}
                  variant="outline-success"
                >
                  Close
                </Button>
              </div>
            </Alert>
            <Alert
              className="m-3"
              show={props.showdanger}
              onClose={() => props.setShowdanger(false)}
              variant="danger"
            >
              <Alert.Heading>Something goes wrong</Alert.Heading>
              <hr />
              <div className="d-flex justify-content-end">
                <Button
                  style={{ borderRadius: '25px' }}
                  onClick={() => props.setShowdanger(false)}
                  variant="outline-danger"
                >
                  Close
                </Button>
              </div>
            </Alert>
            <Alert
              className="m-3"
              show={props.showUpdateError}
              onClose={() => props.setShowUpdateError(false)}
              variant="warning"
            >
              <Alert.Heading style={{ fontSize: 20 }} class="text-danger">
                You must choose only one product type to do the change
              </Alert.Heading>
              <hr />
              <div className="d-flex justify-content-end">
                <Button
                  style={{ borderRadius: '25px' }}
                  onClick={() => props.setShowUpdateError(false)}
                  variant="outline-danger"
                >
                  Close
                </Button>
              </div>
            </Alert>
            <Alert
              className="m-3"
              show={props.showInsufficient}
              onClose={() => props.setShowInsufficient(false)}
              variant="secondary"
            >
              <Alert.Heading style={{ fontSize: 20 }} class="text-danger">
                Cannot add / update products since your wallet balance is
                insufficient
              </Alert.Heading>
              <hr />
              <div className="d-flex justify-content-end">
                <Button
                  style={{ borderRadius: '25px' }}
                  onClick={() => props.setShowInsufficient(false)}
                  variant="outline-danger"
                >
                  Close
                </Button>
              </div>
            </Alert>
          </Row>
        </>
      )}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {'Accepting email sending'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Do you want to send an email to the Client, about confirmation of
            his/her order?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button style={{ borderRadius: '25px' }} onClick={handleCloseDialog}>
            Disagree
          </Button>
          <Button
            style={{ borderRadius: '25px' }}
            onClick={handleSubmitEmail}
            autoFocus
          >
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
export default Basket;
