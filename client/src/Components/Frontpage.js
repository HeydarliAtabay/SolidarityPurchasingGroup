import { useState } from 'react';
import { Button, Row, Carousel, Alert } from 'react-bootstrap';
import { Link, useHistory } from 'react-router-dom';

function Frontpage(props) {
  const logged = props.logged;
  const userRole = props.userRole;
  const userName = props.userName;
  const userMail = props.userMail;

  const getUserAccountType = () => {
    if (userRole === 'client') {
      return 'Client';
    } else if (userRole === 'employee') {
      return 'Shop employee';
    } else if (userRole === 'farmer') {
      return 'Farmer';
    } else if (userRole === 'warehouse-employee') {
      return 'Warehouse employee';
    } else if (userRole === 'warehouse-manager') {
      return 'Warehouse manager';
    } else if (userRole === 'delivery-personnel') {
      return 'Delivery employee';
    }
    return 'Unknown';
  };

  const history = useHistory();

  return (
    <Row className="bg-color-frontpage">
      <div className="col-lg-4">
        <br />
        <br />
        {logged && (
          <Alert variant="success" className="mb-5">
            <Alert.Heading>Nice to see you {userName}!</Alert.Heading>
            <p>
              We hope you are having an awesome day.
              <br />
              Below you can find links to easily navigate the website without
              any hussles.
            </p>
            {(userRole === 'client' || userRole === 'farmer') && (
              <>
                <hr />
                <p className="mb-0">
                  If you need help with anything do not hesitate to contact us.
                </p>
              </>
            )}
          </Alert>
        )}
        {!logged && (
          <div className="card mx-3 my-2 shadow">
            <div className="card-header">
              <h5 className="lead my-auto">{userIcon} Clients</h5>
            </div>
            <ul className="list-group list-group-flush">
              <li className="list-group-item list-group-item-rounded d-flex justify-content-between">
                <div className="d-inline my-auto">Client area</div>
                <div className="d-inline">
                  <button
                    className="mx-2 btn btn-outline-dark"
                    onClick={() => {
                      history.push('/login');
                    }}
                  >
                    Login
                  </button>
                </div>
              </li>
            </ul>
          </div>
        )}
        {logged && userRole === 'client' && (
          <div className="card mx-3 my-2 shadow">
            <div className="card-header">
              <h5 className="my-auto">{userIcon} Client dashboard</h5>
            </div>
            <ul className="list-group list-group-flush">
              <li className="list-group-item d-flex justify-content-between">
                <div className="d-inline my-auto">Client area</div>
                <div className="d-inline">
                  <button
                    className="mx-2 btn btn-outline-dark"
                    onClick={() => {
                      history.push('/client');
                    }}
                  >
                    Go
                  </button>
                </div>
              </li>
              <li className="list-group-item d-flex justify-content-between">
                <div className="d-inline my-auto">Browse products</div>
                <div className="d-inline">
                  <button
                    className="mx-2 btn btn-outline-dark"
                    onClick={() => {
                      history.push('/booking');
                    }}
                  >
                    Go
                  </button>
                </div>
              </li>
              <li className="list-group-item d-flex justify-content-between">
                <div className="d-inline my-auto">Next week products</div>
                <div className="d-inline">
                  <button
                    className="mx-2 btn btn-outline-dark"
                    onClick={() => {
                      history.push('/products-next-week');
                    }}
                  >
                    Go
                  </button>
                </div>
              </li>
              <li className="list-group-item list-group-item-rounded d-flex justify-content-between">
                <div className="d-inline my-auto">My orders</div>
                <div className="d-inline">
                  <button
                    className="mx-2 btn btn-outline-dark"
                    onClick={() => {
                      history.push('/orders');
                    }}
                  >
                    Go
                  </button>
                </div>
              </li>
            </ul>
          </div>
        )}
        {!logged && (
          <div className="card mx-3 my-2 shadow">
            <div className="card-header d-flex justify-content-between">
              <h5 className="d-inline my-auto">{producerIcon} Farmers</h5>
            </div>
            <ul className="list-group list-group-flush">
              <li className="list-group-item d-flex justify-content-between">
                <div className="d-inline my-auto">Farmer area</div>
                <div className="d-inline">
                  <button
                    className="mx-2 btn btn-outline-dark"
                    onClick={() => {
                      history.push('/login');
                    }}
                  >
                    Login
                  </button>
                </div>
              </li>
              <li className="list-group-item list-group-item-rounded d-flex justify-content-between">
                <div className="d-inline my-auto">Want to work with us?</div>
                <div className="d-inline">
                  <button
                    className="mx-2 btn btn-outline-primary"
                    onClick={(event) => {
                      history.push('/farmer-apply');
                    }}
                  >
                    Apply here
                  </button>
                </div>
              </li>
            </ul>
          </div>
        )}
        {logged && userRole === 'farmer' && (
          <div className="card mx-3 my-2 shadow">
            <div className="card-header d-flex justify-content-between">
              <h5 className="d-inline my-auto">
                {producerIcon} Farmer dashboard
              </h5>
            </div>
            <ul className="list-group list-group-flush">
              <li className="list-group-item d-flex justify-content-between">
                <div className="d-inline my-auto">Farmer area</div>
                <div className="d-inline">
                  <button
                    className="mx-2 btn btn-outline-dark"
                    onClick={() => {
                      history.push('/farmer');
                    }}
                  >
                    Go
                  </button>
                </div>
              </li>
              <li className="list-group-item d-flex justify-content-between">
                <div className="d-inline my-auto">Declare availability</div>
                <div className="d-inline">
                  <button
                    className="mx-2 btn btn-outline-dark"
                    onClick={() => {
                      history.push('/declare-availability');
                    }}
                  >
                    Go
                  </button>
                </div>
              </li>
              <li className="list-group-item d-flex justify-content-between">
                <div className="d-inline my-auto">Confirm availability</div>
                <div className="d-inline">
                  <button
                    className="mx-2 btn btn-outline-dark"
                    onClick={() => {
                      history.push('/order-confirmation-farmer');
                    }}
                  >
                    Go
                  </button>
                </div>
              </li>
              <li className="list-group-item d-flex justify-content-between">
                <div className="d-inline my-auto">Order preparation</div>
                <div className="d-inline">
                  <button
                    className="mx-2 btn btn-outline-dark"
                    onClick={() => {
                      history.push('/order-preparation');
                    }}
                  >
                    Go
                  </button>
                </div>
              </li>
              <li className="list-group-item list-group-item-rounded d-flex justify-content-between">
                <div className="d-inline my-auto">My bookings</div>
                <div className="d-inline">
                  <button
                    className="mx-2 btn btn-outline-dark"
                    onClick={() => {
                      history.push('/see-bookings');
                    }}
                  >
                    Go
                  </button>
                </div>
              </li>
            </ul>
          </div>
        )}
        {!logged && (
          <div className="card mx-3 my-2 shadow">
            <div className="card-header d-flex justify-content-between">
              <h5 className="d-inline my-auto">{staffIcon} Staff area</h5>
            </div>
            <ul className="list-group list-group-flush">
              <li className="list-group-item d-flex justify-content-between">
                <div className="d-inline my-auto">Store personnel</div>
                <div className="d-inline">
                  <button
                    className="mx-2 btn btn-outline-dark"
                    onClick={() => {
                      history.push('/login');
                    }}
                  >
                    Login
                  </button>
                </div>
              </li>
              <li className="list-group-item d-flex justify-content-between">
                <div className="d-inline my-auto">Warehouse personnel</div>
                <div className="d-inline">
                  <button
                    className="mx-2 btn btn-outline-dark"
                    onClick={(event) => {
                      history.push('/login');
                    }}
                  >
                    Login
                  </button>
                </div>
              </li>
              <li className="list-group-item list-group-item-rounded d-flex justify-content-between">
                <div className="d-inline my-auto">Delivery personnel</div>
                <div className="d-inline">
                  <button
                    className="mx-2 btn btn-outline-dark"
                    onClick={() => history.push('/login')}
                  >
                    Login
                  </button>
                </div>
              </li>
            </ul>
          </div>
        )}
        {logged && userRole === 'employee' && (
          <div className="card mx-3 my-2 shadow">
            <div className="card-header d-flex justify-content-between">
              <h5 className="d-inline my-auto">
                {producerIcon} Shop employee dashboard
              </h5>
            </div>
            <ul className="list-group list-group-flush">
              <li className="list-group-item d-flex justify-content-between">
                <div className="d-inline my-auto">Staff area</div>
                <div className="d-inline">
                  <button
                    className="mx-2 btn btn-outline-dark"
                    onClick={() => {
                      history.push('/employee');
                    }}
                  >
                    Go
                  </button>
                </div>
              </li>
              <li className="list-group-item d-flex justify-content-between">
                <div className="d-inline my-auto">Register client</div>
                <div className="d-inline">
                  <button
                    className="mx-2 btn btn-outline-dark"
                    onClick={() => {
                      history.push('/dregistration');
                    }}
                  >
                    Go
                  </button>
                </div>
              </li>
              <li className="list-group-item list-group-item-rounded d-flex justify-content-between">
                <div className="d-inline my-auto">Place order for client</div>
                <div className="d-inline">
                  <button
                    className="mx-2 btn btn-outline-dark"
                    onClick={() => {
                      history.push('/staff-booking');
                    }}
                  >
                    Go
                  </button>
                </div>
              </li>
            </ul>
          </div>
        )}
        {logged && userRole === 'warehouse-manager' && (
          <div className="card mx-3 my-2 shadow">
            <div className="card-header d-flex justify-content-between">
              <h5 className="d-inline my-auto">
                {producerIcon} Warehouse manager dashboard
              </h5>
            </div>
            <ul className="list-group list-group-flush">
              <li className="list-group-item d-flex justify-content-between">
                <div className="d-inline my-auto">Warehouse manager area</div>
                <div className="d-inline">
                  <button
                    className="mx-2 btn btn-outline-dark"
                    onClick={() => {
                      history.push('/warehouse-manager');
                    }}
                  >
                    Go
                  </button>
                </div>
              </li>
              <li className="list-group-item d-flex justify-content-between">
                <div className="d-inline my-auto">View pick-up schedule</div>
                <div className="d-inline">
                  <button
                    className="mx-2 btn btn-outline-dark"
                    onClick={() => {
                      history.push('/warehouse-orders');
                    }}
                  >
                    Go
                  </button>
                </div>
              </li>
              <li className="list-group-item list-group-item-rounded d-flex justify-content-between">
                <div className="d-inline my-auto">Manage farmer shipments</div>
                <div className="d-inline">
                  <button
                    className="mx-2 btn btn-outline-dark"
                    onClick={() => {
                      history.push('/warehouse-shipments');
                    }}
                  >
                    Go
                  </button>
                </div>
              </li>
            </ul>
          </div>
        )}
        {logged && userRole === 'warehouse-employee' && (
          <div className="card mx-3 my-2 shadow">
            <div className="card-header d-flex justify-content-between">
              <h5 className="d-inline my-auto">
                {producerIcon} Warehouse employee dashboard
              </h5>
            </div>
            <ul className="list-group list-group-flush">
              <li className="list-group-item d-flex justify-content-between">
                <div className="d-inline my-auto">Warehouse employee area</div>
                <div className="d-inline">
                  <button
                    className="mx-2 btn btn-outline-dark"
                    onClick={() => {
                      history.push('/warehouse-manager');
                    }}
                  >
                    Go
                  </button>
                </div>
              </li>
              <li className="list-group-item list-group-item-rounded d-flex justify-content-between">
                <div className="d-inline my-auto">Manage order preparation</div>
                <div className="d-inline">
                  <button
                    className="mx-2 btn btn-outline-dark"
                    onClick={() => {
                      history.push('/warehouse-prepare');
                    }}
                  >
                    Go
                  </button>
                </div>
              </li>
            </ul>
          </div>
        )}
        {logged && userRole === 'delivery-personnel' && (
          <div className="card mx-3 my-2 shadow">
            <div className="card-header d-flex justify-content-between">
              <h5 className="d-inline my-auto">
                {producerIcon} Delivery personnel dashboard
              </h5>
            </div>
            <ul className="list-group list-group-flush">
              <li className="list-group-item d-flex justify-content-between">
                <div className="d-inline my-auto">Delivery personnel area</div>
                <div className="d-inline">
                  <button
                    className="mx-2 btn btn-outline-dark"
                    onClick={() => {
                      history.push('/delivery');
                    }}
                  >
                    Go
                  </button>
                </div>
              </li>
              <li className="list-group-item list-group-item-rounded d-flex justify-content-between">
                <div className="d-inline my-auto">Manage order preparation</div>
                <div className="d-inline">
                  <button
                    className="mx-2 btn btn-outline-dark"
                    onClick={() => {
                      history.push('/warehouse-prepare');
                    }}
                  >
                    Go
                  </button>
                </div>
              </li>
            </ul>
          </div>
        )}
        {logged && (
          <div className="card mx-3 my-2 shadow">
            <div className="card-header d-flex justify-content-between">
              <h5 className="d-inline my-auto">{userIcon} My account</h5>
            </div>
            <ul className="list-group list-group-flush">
              <li className="list-group-item d-flex justify-content-between">
                <div className="d-inline my-auto">{userName}</div>
              </li>
              <li className="list-group-item d-flex justify-content-between">
                <div className="d-inline my-auto">{userMail}</div>
              </li>
              <li className="list-group-item d-flex justify-content-between">
                <div className="d-inline my-auto">
                  {getUserAccountType()} account
                </div>
              </li>
              <li className="list-group-item list-group-item-rounded text-center">
                <button
                  className="btn btn-outline-secondary w-100"
                  onClick={() => {
                    props.logout();
                    history.push('/');
                  }}
                >
                  Logout
                </button>
              </li>
            </ul>
          </div>
        )}
        {!logged && (
          <div className="card mx-3 my-5 shadow">
            <div className="card-header d-flex justify-content-between">
              <h5 className="d-inline my-auto">
                {joinUsIcon} Want to work with us?
              </h5>
            </div>
            <div className="mx-3 text-center">
              <p className="mt-2">
                <Link to="/farmer-apply">Apply</Link> as a producer
              </p>
              <hr />
              <p>
                <Link to="/">Apply</Link> as a delivery worker
              </p>
            </div>
          </div>
        )}
        <hr></hr>
        {!logged && (
          <div className="card mx-3 my-5 shadow">
            <div className="card-header d-flex justify-content-between">
              <h5 className="d-inline my-auto">
                {aboutUs} A little bit more about us
              </h5>
            </div>
            <ul className="list-group list-group-flush">
              <li className="list-group-item">
                <p className="text-center ">
                  <b>WHO WE ARE?</b>
                </p>
                <p className="text-justify-custom">
                  Who is behind The Beehive that says Yes! ? Get comfortable as
                  we tell you our story, which began in 2015. We have summarized
                  The Beehive in numbers and listed its values. But above all,
                  what we want to share with you is that The Beehive that says
                  Yes! it's a beautiful adventure made up of people. By the way,
                  do you already know our team?
                </p>
              </li>
              <li className="list-group-item list-group-item-rounded">
                <p className="text-center">
                  <b>WHAT DO WE DO?</b>
                </p>
                <p className="text-justify-custom">
                  Ours is a really good job: giving people the tools to eat
                  better and supporting producers who take care of our planet.In
                  our network, passionate men and women find new ways to
                  work.The goal is not simple and the variations are different,
                  but from north to south the spirit is always the same.Here it
                  is summarized in our manifesto.
                </p>
              </li>
            </ul>
          </div>
        )}
        {!logged && <hr />}
        {!logged && (
          <div className="card mx-3 my-5 shadow">
            <div className="card-header d-flex justify-content-between">
              <h5 className="d-inline my-auto">
                {ourLocation} Where to find us
              </h5>
            </div>
            <ul className="list-group list-group-flush">
              <li className="list-group-item list-group-item-rounded d-flex justify-content-between">
                <img
                  className="d-block w-100 rounded"
                  alt="Map location"
                  src={process.env.PUBLIC_URL + 'Frontpage/map-image.png'}
                />
              </li>
            </ul>
          </div>
        )}
      </div>
      <div className="col-lg-8 vertical-separator-frontpage">
        <div className="text-center mt-5 mb-3">
          <span className="d-block text-center mt-5 mb-1 display-2">
            Solidarity Purchasing Group
          </span>
          <span className="d-block mx-auto mb-2 text-center text-muted lead">
            Your ultimate fresh and bio food destination
          </span>
          <br></br>
        </div>
        <div className="d-block mx-5 shadow-lg">
          <Carousel variant="dark">
            <Carousel.Item interval={10000}>
              <img
                className="d-block w-100"
                src={process.env.PUBLIC_URL + 'Frontpage/1.jpg'}
                alt="Products"
              />
              <Carousel.Caption className="carousel-custom-background">
                <h3>Fresh, local and bio produce</h3>
                <p>
                  In our store you will find only the freshest and the best
                  produce. All from local farms and producers.
                </p>
              </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item interval={10000}>
              <img
                className="d-block w-100"
                src={process.env.PUBLIC_URL + 'Frontpage/2.jpg'}
                alt="Farmers"
              />
              <Carousel.Caption className="carousel-custom-background">
                <h3>These are our heroes</h3>
                <p>
                  More than 50 farmers work tirelessly to deliver only the best
                  produce to your dish.
                </p>
              </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item interval={10000}>
              <img
                className="d-block w-100"
                src={process.env.PUBLIC_URL + 'Frontpage/3.jpg'}
                alt="Delivery"
              />
              <Carousel.Caption className="carousel-custom-background">
                <h3>Fresh, right at your doorstep</h3>
                <p>
                  With a dedicated team of delivery workers, the local fresh
                  produce has never been closer to your home.
                </p>
              </Carousel.Caption>
            </Carousel.Item>
          </Carousel>
        </div>
        <div
          className="d-block w-100 pt-5 pb-3 px-5 mt-5 rounded-top"
          style={{ backgroundColor: '#A69C98' }}
        >
          <div className="row">
            <div className="col-md-8">
              <h2 className="d-block">Meet our products</h2>
              <p className="d-block text-justify-custom">
                With more than 250 products weekly we ensure that you will find
                everything you need to prepare all your healthy dishes. We check
                and handpick each product one by one to make sure that on your
                table you will put only the freshest products.
              </p>
              <br />
              <div className="d-block w-100">
                <Button
                  variant="light"
                  onClick={() => {
                    history.push('/booking');
                  }}
                >
                  Explore our products
                </Button>
              </div>
            </div>
            <div className="col-md-4 text-center">
              <img
                className="product-img-custom-dimensions my-auto mx-auto"
                src={
                  process.env.PUBLIC_URL + 'Frontpage/browse-products-image.png'
                }
                alt="Product"
              />
            </div>
          </div>
          <br />
        </div>
        <div
          className="d-block w-100 pt-5 pb-0 px-5"
          style={{
            backgroundImage: 'linear-gradient(to bottom, #A69C98 90%, #D98C5F)',
          }}
        >
          <div className="row">
            <div className="col-lg-4 text-center">
              <img
                className="farmer-img-custom-dimensions mx-auto my-auto"
                src={
                  process.env.PUBLIC_URL + 'Frontpage/browse-farmers-image.png'
                }
                alt="Product"
              />
            </div>
            <div className="col-lg-8">
              <h2 className="d-block">The producers</h2>
              <p className="d-block text-justify-custom">
                With more than 250 products weekly we ensure that you will find
                everything you need to prepare all your healthy dishes. We check
                and handpick each product one by one to make sure that on your
                table you will put only the freshest products.
              </p>
              <div className="d-block w-100 mt-5 text-right-custom align-bottom-custom">
                <Button variant="light">Meet the producers</Button>
              </div>
            </div>
          </div>
          <br />
        </div>
        <div
          className="d-block w-100 pt-5 pb-0 px-5 rounded-bottom"
          style={{
            backgroundImage:
              'linear-gradient(to bottom, #D98C5F 20%, #D98C5F 80%)',
          }}
        >
          <div className="row">
            <div className="col-lg-8">
              <h2 className="d-block text-light">Lorem ipsum</h2>
              <p className="d-block text-light text-justify-custom">
                With more than 250 products weekly we ensure that you will find
                everything you need to prepare all your healthy dishes. We check
                and handpick each product one by one to make sure that on your
                table you will put only the freshest products.
              </p>
              <div className="d-block w-100 mt-2 text-center align-bottom-custom">
                <Button variant="secondary">This is a button</Button>
              </div>
            </div>
            <div className="col-lg-4 text-center">
              <img
                className="product-img-custom-dimensions my-auto mx-auto d-block"
                src={
                  process.env.PUBLIC_URL + 'Frontpage/browse-products-image.png'
                }
                alt="Product"
              />
            </div>
          </div>
          <br />
        </div>
        <div
          className="d-block w-100 pt-5 pb-0 px-5 mb-5 rounded-bottom"
          style={{
            backgroundImage:
              'linear-gradient(to bottom, #D98C5F 20%, #D98C5F 80%)',
          }}
        >
          <div className="row">
            <div className="col-lg-4 text-center">
              <img
                className="farmer-img-custom-dimensions mx-auto my-auto"
                src={
                  process.env.PUBLIC_URL + 'Frontpage/browse-farmers-image.png'
                }
                alt="Product"
              />
            </div>
            <div className="col-lg-8">
              <h2 className="d-block text-light">Working with us</h2>
              <p className="d-block text-light text-justify-custom">
                With more than 250 products weekly we ensure that you will find
                everything you need to prepare all your healthy dishes. We check
                and handpick each product one by one to make sure that on your
                table you will put only the freshest products.
              </p>
              <div className="d-block w-100 mt-5 text-center align-bottom-custom">
                <Button variant="secondary mb-3 me-3">Apply as farmer</Button>
                <Button variant="secondary mb-3">Apply as deliverer</Button>
              </div>
            </div>
          </div>
          <br />
        </div>
      </div>
    </Row>
  );
}

const userIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="32"
    height="32"
    fill="currentColor"
    className="bi bi-person"
    viewBox="0 0 16 16"
  >
    <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z" />
  </svg>
);

const producerIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="32"
    height="32"
    fill="currentColor"
    className="bi bi-basket"
    viewBox="0 0 16 16"
  >
    <path d="M5.757 1.071a.5.5 0 0 1 .172.686L3.383 6h9.234L10.07 1.757a.5.5 0 1 1 .858-.514L13.783 6H15a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1v4.5a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 1 13.5V9a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h1.217L5.07 1.243a.5.5 0 0 1 .686-.172zM2 9v4.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V9H2zM1 7v1h14V7H1zm3 3a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0v-3A.5.5 0 0 1 4 10zm2 0a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0v-3A.5.5 0 0 1 6 10zm2 0a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0v-3A.5.5 0 0 1 8 10zm2 0a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0v-3a.5.5 0 0 1 .5-.5zm2 0a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0v-3a.5.5 0 0 1 .5-.5z" />
  </svg>
);

const staffIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="32"
    height="32"
    fill="currentColor"
    className="bi bi-shop"
    viewBox="0 0 16 16"
  >
    <path d="M2.97 1.35A1 1 0 0 1 3.73 1h8.54a1 1 0 0 1 .76.35l2.609 3.044A1.5 1.5 0 0 1 16 5.37v.255a2.375 2.375 0 0 1-4.25 1.458A2.371 2.371 0 0 1 9.875 8 2.37 2.37 0 0 1 8 7.083 2.37 2.37 0 0 1 6.125 8a2.37 2.37 0 0 1-1.875-.917A2.375 2.375 0 0 1 0 5.625V5.37a1.5 1.5 0 0 1 .361-.976l2.61-3.045zm1.78 4.275a1.375 1.375 0 0 0 2.75 0 .5.5 0 0 1 1 0 1.375 1.375 0 0 0 2.75 0 .5.5 0 0 1 1 0 1.375 1.375 0 1 0 2.75 0V5.37a.5.5 0 0 0-.12-.325L12.27 2H3.73L1.12 5.045A.5.5 0 0 0 1 5.37v.255a1.375 1.375 0 0 0 2.75 0 .5.5 0 0 1 1 0zM1.5 8.5A.5.5 0 0 1 2 9v6h1v-5a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v5h6V9a.5.5 0 0 1 1 0v6h.5a.5.5 0 0 1 0 1H.5a.5.5 0 0 1 0-1H1V9a.5.5 0 0 1 .5-.5zM4 15h3v-5H4v5zm5-5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-3zm3 0h-2v3h2v-3z" />
  </svg>
);

const joinUsIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="32"
    height="32"
    fill="currentColor"
    className="bi bi-people"
    viewBox="0 0 16 16"
  >
    <path d="M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1h8zm-7.978-1A.261.261 0 0 1 7 12.996c.001-.264.167-1.03.76-1.72C8.312 10.629 9.282 10 11 10c1.717 0 2.687.63 3.24 1.276.593.69.758 1.457.76 1.72l-.008.002a.274.274 0 0 1-.014.002H7.022zM11 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0zM6.936 9.28a5.88 5.88 0 0 0-1.23-.247A7.35 7.35 0 0 0 5 9c-4 0-5 3-5 4 0 .667.333 1 1 1h4.216A2.238 2.238 0 0 1 5 13c0-1.01.377-2.042 1.09-2.904.243-.294.526-.569.846-.816zM4.92 10A5.493 5.493 0 0 0 4 13H1c0-.26.164-1.03.76-1.724.545-.636 1.492-1.256 3.16-1.275zM1.5 5.5a3 3 0 1 1 6 0 3 3 0 0 1-6 0zm3-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" />
  </svg>
);

const aboutUs = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="32"
    height="32"
    fill="currentColor"
    className="bi bi-info-circle"
    viewBox="0 0 16 16"
  >
    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
    <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
  </svg>
);

const ourLocation = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="32"
    height="32"
    fill="currentColor"
    className="bi bi-pin-map"
    viewBox="0 0 16 16"
  >
    <path
      fillRule="evenodd"
      d="M3.1 11.2a.5.5 0 0 1 .4-.2H6a.5.5 0 0 1 0 1H3.75L1.5 15h13l-2.25-3H10a.5.5 0 0 1 0-1h2.5a.5.5 0 0 1 .4.2l3 4a.5.5 0 0 1-.4.8H.5a.5.5 0 0 1-.4-.8l3-4z"
    />
    <path
      fillRule="evenodd"
      d="M8 1a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM4 4a4 4 0 1 1 4.5 3.969V13.5a.5.5 0 0 1-1 0V7.97A4 4 0 0 1 4 3.999z"
    />
  </svg>
);

export default Frontpage;
