import React, { useState, useEffect } from "react";

import AuthService from "../../services/auth.service";
import PassengerJourney from "./passengerJourney.component"



export default function Passenger () {
  const user = AuthService.getCurrentUser();
  const isPassenger = user.role.includes('ROLE_PASSENGER')
  useEffect( () =>{   
    
  },[])
  
    if(!isPassenger) {
      return null;
    } 
    return (
      <React.Fragment>
        <div className="container ">
        <div className="col">
          <header className="jumbotron">
            <h3>Passenger</h3>
            {!user.Phone ? <h3>Vui lòng cập nhật Thông tin để sử dụng chức năng gọi xe</h3> : <PassengerJourney />  }                      
          </header>    
        </div>    
        </div>
      </React.Fragment>
      
    );
}
