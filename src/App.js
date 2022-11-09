import React, { Component } from "react";
import { Routes, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import AuthService from "./services/auth.service";

import Login from "./components/login.component";
import Register from "./components/register.component";
import Home from "./components/home.component";
import Profile from "./components/profile.component";
import Passenger from "./components/passengers/passengers.component";
import Driver from "./components/drivers/driver.component";
import SupportStaff from "./components/supportstaff/supportstaff.component";
import NewUser from "./components/newuser/newuser.component";
import EventBus from "./common/EventBus";
import HistoryPassenger from "./components/passengers/history.passenger.component";
import HistoryDriver from "./components/drivers/history.driver.component";
import HistorySupportStaff from "./components/supportstaff/history.supportstaff.component";


class App extends Component {
  constructor(props) {
    super(props);
    this.logOut = this.logOut.bind(this);

    this.state = {
      showDriver: false,
      showPassenger: false,
      showSupportStaff: false,
      currentUser: undefined
    };
  }

  componentDidMount() {
    const user = AuthService.getCurrentUser();
    
    if (user) {
      this.setState({        
        showDriver: user.role.includes('ROLE_DRIVER'),
        showPassenger: user.role.includes('ROLE_PASSENGER'),
        showSupportStaff: user.role.includes('ROLE_SUPPORTSTAFF'),
        currentUser: user,      
      });
    }
    
    EventBus.on("logout", () => {
      this.logOut();
    });
  }

  componentWillUnmount() {
    EventBus.remove("logout");
  }

  logOut() {
    AuthService.logout();
    this.setState({
      showDriver: false,
      showPassenger: false,
      showSupportStaff: false,
      currentUser: undefined,
    });
  }
  

  render() {
    const { currentUser, showDriver, showPassenger, showSupportStaff } = this.state;
    
    return (
      <div>
        <nav className="navbar navbar-expand navbar-dark bg-dark">
          
          <Link to={"/"} className="navbar-brand">
            GoCarVietNam
          </Link>
          <div className="navbar-nav mr-auto">
            
            { currentUser && showDriver  && (
              <li className="nav-item">
                <Link to={"/driver"} className="nav-link">
                  Driver
                </Link>
              </li>
            )}
            { currentUser && showDriver  && (
              <li className="nav-item">
                <Link to={"/historydriver"} className="nav-link">
                  History Driver
                </Link>
              </li>
            )}

            { currentUser && showSupportStaff  && (
              <li className="nav-item">
                <Link to={"/supportstaff"} className="nav-link">
                  Support Staff
                </Link>
              </li>
            )}

            { currentUser && showSupportStaff  && (
              <li className="nav-item">
                <Link to={"/newuser"} className="nav-link">
                  Create User
                </Link>
              </li>
            )}
            { currentUser && showSupportStaff  && (
              <li className="nav-item">
                <Link to={"/historysupportstaff"} className="nav-link">
                  History Support Staff
                </Link>
              </li>
            )}

            { currentUser && showPassenger && (
              <li className="nav-item">
                <Link to={"/passenger"} className="nav-link">
                  Passenger
                </Link>
              </li>
            )}

            { currentUser && showPassenger && (
              <li className="nav-item">
                <Link to={"/historypassenger"} className="nav-link">
                  History Passenger
                </Link>
              </li>
            )}
          </div>

          {currentUser ? (
            <div className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link to={"/profile"} className="nav-link">
                  Welcome {currentUser.name}
                </Link>
              </li>
              <li className="nav-item">
                <a href="/login" className="nav-link" onClick={this.logOut}>
                  LogOut
                </a>
              </li>
            </div>
          ) : (
            <div className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link to={"/login"} className="nav-link">
                  Login
                </Link>
              </li>

              <li className="nav-item">
                <Link to={"/register"} className="nav-link">
                  Register
                </Link>
              </li>
            </div>
          )}
        </nav>

        <div className="container mt-3">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/passenger" element={<Passenger />} />
            <Route path="/historypassenger" element={<HistoryPassenger />} />
            <Route path="/driver" element={<Driver/>} />
            <Route path="/historydriver" element={<HistoryDriver/>} />
            <Route path="/supportstaff" element={<SupportStaff />} />
            <Route path="/historysupportstaff" element={<HistorySupportStaff />} />
            <Route path="/newuser" element={<NewUser />} />
          </Routes>
        </div>

        {/* <AuthVerify logOut={this.logOut}/> */}
      </div>
    );
  }
}

export default App;
