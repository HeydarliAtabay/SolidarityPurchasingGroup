import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';

var isBetween = require('dayjs/plugin/isBetween');
dayjs.extend(isBetween);
var isSameOrBefore = require('dayjs/plugin/isSameOrBefore');
dayjs.extend(isSameOrBefore);
var isSameOrAfter = require('dayjs/plugin/isSameOrAfter');
dayjs.extend(isSameOrAfter);

function FarmerArea(props) {

  function intervalTimeBoolean() {
    if (dayjs(props.time.date).day() === 1) {
      if (dayjs('01/01/2021 ' + props.time.hour).hour() < 9) return false;
      else {
        return true;
      }
    }
    if (dayjs(props.time.date).day() > 1 && dayjs(props.time.date).day() < 6) {
      return true;
    }
    if (dayjs(props.time.date).day() === 6) {
      if (dayjs('01/01/2021 ' + props.time.hour).hour() > 8) return false;
      else {
        return true;
      }
    }
    return false;
  }

  return (
    <div className="row w-100">
      
      <span className="d-block text-center mt-5 mb-2 display-2">
        Farmer Area
      </span>
      <div className="col-lg-3">
        <div className="card mx-3 my-2 shadow-sm">
          <div className="card-header d-flex justify-content-between">
            <h5 className="d-inline my-auto">Your profile</h5>
          </div>
          <ul className="list-group list-group-flush">
            <li className="list-group-item d-flex justify-content-between">
              {props.userName}
            </li>
            <li className="list-group-item d-flex justify-content-between">
              {props.userMail}
            </li>
          </ul>
        </div>
      </div>
      <div className="col-lg-9 ">
        <div className="row w-100">
          <div className="col-lg-12">
            <div className="card m-3 w-100">
              <div className="row no-gutters">
                <div className="col-md-4 bg-secondary p-3 text-center">
                  {declareIcon}
                </div>
                <div className="col-md-8">
                  <div className="card-body">
                    <h5 className="card-title">
                      Declare products availability
                    </h5>
                    <p>
                      Here you can report the expected available product amounts
                      for the next week
                    </p>
                    <p className="card-text">
                      • You can declare items for the next week from Monday
                      until Saturday 09.00AM <br />
                    </p>
                    <div className="d-block text-end">
                      {intervalTimeBoolean() ? (
                        <Link to="/declare-availability">
                          <button className="btn btn-primary">
                            Declare availability
                          </button>
                        </Link>
                      ) : (
                        <button disabled className="btn btn-primary">
                          Declare availability
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row w-100">
          <div className="col-lg-12">
            <div className="card m-3 w-100">
              <div className="row no-gutters">
                <div className="col-md-4 bg-secondary p-3 text-center">
                  {availabilityIcon}
                </div>
                <div className="col-md-8">
                  <div className="card-body">
                    <h5 className="card-title">Confirm product availability</h5>
                    <p className="card-text">
                      • You can confirm items availability starting Saturday
                      09.00AM until Monday 09.00AM <br />
                      <br />
                    </p>
                    <div className="d-block text-end">
                      {!intervalTimeBoolean() ? (
                        <Link to="/order-confirmation-farmer">
                          <button className="btn btn-primary">
                            Confirm availability
                          </button>
                        </Link>
                      ) : (
                        <button disabled className="btn btn-primary">
                          Confirm availability
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row w-100">
          <div className="col-lg-12">
            <div className="card m-3 w-100">
              <div className="row no-gutters">
                <div className="col-md-4 bg-secondary p-3 text-center">
                  {perparationIcon}
                </div>
                <div className="col-md-8">
                  <div className="card-body">
                    <h5 className="card-title">Confirm order preparation</h5>
                    <p className="card-text">
                      • Confirm the preparation of the booked orders to ship to
                      the SPG shop
                    </p>
                    <div className="d-block text-end">
                      <Link to="/order-preparation">
                        <button className="btn btn-primary">
                          Confirm preparation
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row w-100">
          <div className="col-lg-12">
            <div className="card m-3 w-100">
              <div className="row no-gutters">
                <div className="col-md-4 bg-secondary p-3 text-center">
                  {walletIcon}
                </div>
                <div className="col-md-8">
                  <div className="card-body">
                    <h5 className="card-title">Bookings</h5>
                    <p className="card-text">
                      • See the list of all the booked orders
                    </p>
                    <div className="d-block text-end">
                      <Link to="/see-bookings">
                        <button className="btn btn-primary">
                          See bookings
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const declareIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="128"
    height="128"
    fill="currentColor"
    className="bi bi-boxes"
    viewBox="0 0 16 16"
  >
    <path d="M7.752.066a.5.5 0 0 1 .496 0l3.75 2.143a.5.5 0 0 1 .252.434v3.995l3.498 2A.5.5 0 0 1 16 9.07v4.286a.5.5 0 0 1-.252.434l-3.75 2.143a.5.5 0 0 1-.496 0l-3.502-2-3.502 2.001a.5.5 0 0 1-.496 0l-3.75-2.143A.5.5 0 0 1 0 13.357V9.071a.5.5 0 0 1 .252-.434L3.75 6.638V2.643a.5.5 0 0 1 .252-.434L7.752.066ZM4.25 7.504 1.508 9.071l2.742 1.567 2.742-1.567L4.25 7.504ZM7.5 9.933l-2.75 1.571v3.134l2.75-1.571V9.933Zm1 3.134 2.75 1.571v-3.134L8.5 9.933v3.134Zm.508-3.996 2.742 1.567 2.742-1.567-2.742-1.567-2.742 1.567Zm2.242-2.433V3.504L8.5 5.076V8.21l2.75-1.572ZM7.5 8.21V5.076L4.75 3.504v3.134L7.5 8.21ZM5.258 2.643 8 4.21l2.742-1.567L8 1.076 5.258 2.643ZM15 9.933l-2.75 1.571v3.134L15 13.067V9.933ZM3.75 14.638v-3.134L1 9.933v3.134l2.75 1.571Z" />
  </svg>
);

const availabilityIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="128"
    height="128"
    fill="currentColor"
    className="bi bi-card-checklist"
    viewBox="0 0 16 16"
  >
    <path d="M14.5 3a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h13zm-13-1A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-13z" />
    <path d="M7 5.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm-1.496-.854a.5.5 0 0 1 0 .708l-1.5 1.5a.5.5 0 0 1-.708 0l-.5-.5a.5.5 0 1 1 .708-.708l.146.147 1.146-1.147a.5.5 0 0 1 .708 0zM7 9.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm-1.496-.854a.5.5 0 0 1 0 .708l-1.5 1.5a.5.5 0 0 1-.708 0l-.5-.5a.5.5 0 0 1 .708-.708l.146.147 1.146-1.147a.5.5 0 0 1 .708 0z" />
  </svg>
);

const perparationIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="128"
    height="128"
    fill="currentColor"
    className="bi bi-truck"
    viewBox="0 0 16 16"
  >
    <path d="M0 3.5A1.5 1.5 0 0 1 1.5 2h9A1.5 1.5 0 0 1 12 3.5V5h1.02a1.5 1.5 0 0 1 1.17.563l1.481 1.85a1.5 1.5 0 0 1 .329.938V10.5a1.5 1.5 0 0 1-1.5 1.5H14a2 2 0 1 1-4 0H5a2 2 0 1 1-3.998-.085A1.5 1.5 0 0 1 0 10.5v-7zm1.294 7.456A1.999 1.999 0 0 1 4.732 11h5.536a2.01 2.01 0 0 1 .732-.732V3.5a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5v7a.5.5 0 0 0 .294.456zM12 10a2 2 0 0 1 1.732 1h.768a.5.5 0 0 0 .5-.5V8.35a.5.5 0 0 0-.11-.312l-1.48-1.85A.5.5 0 0 0 13.02 6H12v4zm-9 1a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm9 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" />
  </svg>
);
const walletIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="128"
    height="128"
    fill="currentColor"
    className="bi bi-wallet"
    viewBox="0 0 16 16"
  >
    <path d="M0 3a2 2 0 0 1 2-2h13.5a.5.5 0 0 1 0 1H15v2a1 1 0 0 1 1 1v8.5a1.5 1.5 0 0 1-1.5 1.5h-12A2.5 2.5 0 0 1 0 12.5V3zm1 1.732V12.5A1.5 1.5 0 0 0 2.5 14h12a.5.5 0 0 0 .5-.5V5H2a1.99 1.99 0 0 1-1-.268zM1 3a1 1 0 0 0 1 1h12V2H2a1 1 0 0 0-1 1z" />
  </svg>
); 
export default FarmerArea;
