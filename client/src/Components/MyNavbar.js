
const Navbar = function (props) {

    return (

        <nav className="navbar navbar-expand-lg menu-bar">
            <div className="container-fluid">
                <a className="navbar-brand" href="#">Solidarity Purchasing Group</a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <a className="nav-link active" aria-current="page" href="/home">Home</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link active" aria-current="page" href="/client">Client</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link active" aria-current="page" href="/employee">Staff</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link active" aria-current="page" href="/farmer">Farmer</a>
                        </li>
                    </ul>
                    <form className="form-inline">
                        <select onChange={(event) => props.setTime((time) => ({ day: event.target.value, hour: time.hour }))} defaultValue={props.time.day} className="form-control-sm mr-2">
                            <option value="monday">Monday</option>
                            <option value="tuesday">Tuesday</option>
                            <option value="wednesday">Wednesday</option>
                            <option value="thursday">Thursday</option>
                            <option value="friday">Friday</option>
                            <option value="saturday">Saturday</option>
                            <option value="sunday">Sunday</option>
                        </select>
                        <select onChange={(event) => props.setTime((time) => ({ day: time.day, hour: event.target.value }))} defaultValue={props.time.hour} className="form-control-sm mr-3">
                            <option value="00">00:00</option>
                            <option value="01">01:00</option>
                            <option value="02">02:00</option>
                            <option value="03">03:00</option>
                            <option value="04">04:00</option>
                            <option value="05">05:00</option>
                            <option value="06">06:00</option>
                            <option value="07">07:00</option>
                            <option value="08">08:00</option>
                            <option value="09">09:00</option>
                            <option value="10">10:00</option>
                            <option value="11">11:00</option>
                            <option value="12">12:00</option>
                            <option value="13">13:00</option>
                            <option value="14">14:00</option>
                            <option value="15">15:00</option>
                            <option value="16">16:00</option>
                            <option value="17">17:00</option>
                            <option value="18">18:00</option>
                            <option value="19">19:00</option>
                            <option value="20">20:00</option>
                            <option value="21">21:00</option>
                            <option value="22">22:00</option>
                            <option value="23">23:00</option>
                        </select>
                    </form>
                </div>
            </div>
        </nav>

    );
}



export default Navbar;