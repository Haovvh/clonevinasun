import React, { useState, useEffect } from "react";
import GoongMap from "../Goong/GoongMap";
import AuthService from "../services/auth.service";

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
        <div className="container">
        <header className="jumbotron">
          <h3>Passenger</h3>
        </header>
        </div>
        <div>
          <GoongMap/>
        </div>
      </React.Fragment>
      
    );
}
