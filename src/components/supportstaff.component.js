import React, { useState, useEffect } from "react";
import GoongMap from "../Goong/GoongMap";
import UserService from "../services/user.service";
import EventBus from "../common/EventBus";
import AuthService from "../services/auth.service";

export default function SupportStaff () {
  
  const [isSupportStaff, setIsSupportStaff] = useState(false)

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
      <div className="container">
        <header className="jumbotron">
          <h3>SupportStaff</h3>
        </header>
      </div>
    );
}
