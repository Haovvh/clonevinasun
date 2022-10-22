import React, { useState, useEffect } from "react";

import AuthService from "../services/auth.service";
import InputJourney from "./InputJourney.component";
export default function Passenger () {  

  const [isPassenger, setIsPassenger] = useState(false)

  useEffect( () =>{
    const user = AuthService.getCurrentUser();
    if (user) {
      setIsPassenger(user.roles.includes('ROLE_PASSENGER')
      );
    }
  },[isPassenger] )

  
    if(!isPassenger) {
      return null;
    }
    return (
      <React.Fragment>
        <div className="container ">
        <div className="col">
          <header className="jumbotron">
            <h3>Passenger</h3>
            <InputJourney warn={true} />
            
          </header>    
        </div>    
        </div>
      </React.Fragment>
      
    );
}
