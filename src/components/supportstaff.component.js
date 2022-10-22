import React, { useState, useEffect } from "react";
import GoongMap from "../Goong/GoongMap";
import UserService from "../services/user.service";
import EventBus from "../common/EventBus";
import AuthService from "../services/auth.service";
import InputJourney from "./InputJourney.component";
import CustomerInfo from "./customer-info.component";
export default function SupportStaff () {
  
  const [isSupportStaff, setIsSupportStaff] = useState(false)
  const [show, setShow] = useState(true)
  const [status, setStatus] = useState("getCustomer")


  useEffect( () =>{
    const user = AuthService.getCurrentUser();
    if (user) {
      setIsSupportStaff(user.roles.includes('ROLE_SUPPORTSTAFF')
      );
    }
  },[isSupportStaff] )

  
    if(!isSupportStaff) {
      return null;
    }

 
    return (
      <React.Fragment>
        <div className="container">
        <header className="jumbotron">
          <h3>SupportStaff</h3>         
          
        </header>
        </div>
        <div className="card-container">
          <div className="col-md-12">
            <div className="form-group">
              <label htmlFor="phonecustomer">Phone Customer: </label>
              <input
                placeholder="Phone Customer"
                type="phone"
                className="form-control"
              />
            </div>
            <div className="form-group">
              <button className="btn btn-primary btn-block" onClick={() => { setShow(!show) }}>
                {status === "getCustomer" ? 'Show Customer' : ((status === "bookdriver") ? "Book Driver" : "Complete")}</button>
            </div>
          </div>
          <CustomerInfo warn={show} />
        <InputJourney warn={show} /> 
        </div>
      </React.Fragment>
      
    );
}
