import { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import API from '../API';
import dayjs from 'dayjs';

function ManagerArea(props) {

  const history = useHistory();

  const [pendingStats, setPendingStats] = useState();
  const [acceptedStats, setAcceptedStats] = useState();
  const [overallStats, setOverallStats] = useState();

  useEffect(() => {
    const getApplicationStats = async () => {
      const pendingApplications = await API.getFarmerPendingApplications();

      setPendingStats({ total: pendingApplications.length });

      const acceptedApplications = await API.getFarmerAcceptedApplications();

      let accepted = 0;
      let rejected = 0;
      acceptedApplications.forEach(app => {
        if (app.status === 'accepted') {
          accepted++;
        }
        else if (app.status === 'rejected') {
          rejected++;
        }
      });

      setAcceptedStats({ total: acceptedApplications.length, accepted: accepted, rejected: rejected });

      const allApplications = [...pendingApplications, ...acceptedApplications];

      let curr_time = dayjs(props.time.date + " " + props.time.hour);
      let today = 0;
      let this_week = 0;
      let this_month = 0;
      allApplications.forEach(app => {
        if (curr_time.diff(app.date, 'day') === 0) {
          today++;
        }
        else if (curr_time.diff(app.date, 'week') === 0) {
          this_week++;
        }
        else if (curr_time.diff(app.date, 'month') === 0) {
          this_month++;
        }
      });

      setOverallStats({ today: today, this_week: this_week, this_month: this_month });

    }
    getApplicationStats();
  }, []);


  return (
    <div className="row w-100">

      <span className="d-block text-center mt-5 mb-2 display-2">
        Shop Manager Area
      </span>
      <div className="col-lg-3">
        <div className="card mx-3 my-2 shadow">
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
        <div className="card mx-3 my-2 shadow">
          <div className="card-header d-flex justify-content-between">
            <h5 className="d-inline my-auto">Application stats</h5>
          </div>
          <ul className="list-group list-group-flush">
            <li className="list-group-item d-flex justify-content-between">
              {pendingStats && 'Pending: '+pendingStats.total}
            </li>
            <li className="list-group-item d-flex justify-content-between">
              {acceptedStats && 'Accepted: '+acceptedStats.accepted}
            </li>
            <li className="list-group-item d-flex justify-content-between">
              {acceptedStats && 'Rejected: '+acceptedStats.rejected}
            </li>
            <li className="list-group-item d-flex justify-content-between">
              {overallStats && 'Received today: '+overallStats.today}
            </li>
            <li className="list-group-item d-flex justify-content-between">
              {overallStats && 'Received this week: '+overallStats.this_week}
            </li>
            <li className="list-group-item d-flex justify-content-between">
              {overallStats && 'Received this month: '+overallStats.this_month}
            </li>
          </ul>
        </div>
        <div className="d-block mx-3 my-4">
          <button className="btn btn-outline-secondary w-100" onClick={() => { props.logout(); history.push("/") }}>Logout</button>
        </div>
      </div>
      <div className="col-lg-9 ">
        <div className="card m-3 d-block shadow">
          <div className="row no-gutters">
            <div className="col-md-4 p-3 text-center" style={{ backgroundColor: "#A6896F" }}>
              {pendingApps}
            </div>
            <div className="col-md-8">
              <div className="card-body">
                <h5 className="card-title">Pending farmer applications</h5>
                <p className="card-text">
                  • View &#38; browse pending farmer applications<br />
                  • Accept or decline a farmer application<br />
                </p>
                <div className="d-block text-end">
                  <Link to="/manager/applications/pending">
                    <button className="btn" style={{ backgroundColor: "#A6896F", color: "black" }}>Browse pending applications</button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card m-3 d-block shadow">
          <div className="row no-gutters">
            <div className="col-md-4 p-3 text-center" style={{ backgroundColor: "#D9C9BA" }}>
              {acceptedApps}
            </div>
            <div className="col-md-8">
              <div className="card-body">
                <h5 className="card-title">Accepted/rejected farmer applications</h5>
                <p className="card-text">
                  • View &#38; browse accepted or rejected farmer applications<br />
                  • Inspect a farmer application<br />
                  • Accept a previously rejected application<br />
                </p>
                <div className="d-block text-end">
                  <Link to="/manager/applications/processed">
                    <button className="btn" style={{ backgroundColor: "#D9C9BA", color: "black" }}>Browse processed applications</button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const pendingApps =
  <svg width="128" height="128" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="envelopes-bulk" className="svg-inline--fa fa-envelopes-bulk" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path fill="currentColor" d="M191.9 448.6c-9.766 0-19.48-2.969-27.78-8.891L32 340.2V480c0 17.62 14.38 32 32 32h256c17.62 0 32-14.38 32-32v-139.8L220.2 439.5C211.7 445.6 201.8 448.6 191.9 448.6zM192 192c0-35.25 28.75-64 64-64h224V32c0-17.62-14.38-32-32-32H128C110.4 0 96 14.38 96 32v192h96V192zM320 256H64C46.38 256 32 270.4 32 288v12.18l151 113.8c5.25 3.719 12.7 3.734 18.27-.25L352 300.2V288C352 270.4 337.6 256 320 256zM576 160H256C238.4 160 224 174.4 224 192v32h96c33.25 0 60.63 25.38 63.75 57.88L384 416h192c17.62 0 32-14.38 32-32V192C608 174.4 593.6 160 576 160zM544 288h-64V224h64V288z"></path></svg>


const acceptedApps =
  <svg width="128" height="128" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="users" className="svg-inline--fa fa-users" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path fill="currentColor" d="M319.9 320c57.41 0 103.1-46.56 103.1-104c0-57.44-46.54-104-103.1-104c-57.41 0-103.1 46.56-103.1 104C215.9 273.4 262.5 320 319.9 320zM369.9 352H270.1C191.6 352 128 411.7 128 485.3C128 500.1 140.7 512 156.4 512h327.2C499.3 512 512 500.1 512 485.3C512 411.7 448.4 352 369.9 352zM512 160c44.18 0 80-35.82 80-80S556.2 0 512 0c-44.18 0-80 35.82-80 80S467.8 160 512 160zM183.9 216c0-5.449 .9824-10.63 1.609-15.91C174.6 194.1 162.6 192 149.9 192H88.08C39.44 192 0 233.8 0 285.3C0 295.6 7.887 304 17.62 304h199.5C196.7 280.2 183.9 249.7 183.9 216zM128 160c44.18 0 80-35.82 80-80S172.2 0 128 0C83.82 0 48 35.82 48 80S83.82 160 128 160zM551.9 192h-61.84c-12.8 0-24.88 3.037-35.86 8.24C454.8 205.5 455.8 210.6 455.8 216c0 33.71-12.78 64.21-33.16 88h199.7C632.1 304 640 295.6 640 285.3C640 233.8 600.6 192 551.9 192z"></path></svg>

export default ManagerArea;
