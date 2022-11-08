import React from "react";
import AuthService from "../services/auth.service";
import ProfilePassenger from "./profile.Passenger.component";
import ProfileDriver from "./profile.Driver.component";


const user = AuthService.getCurrentUser();
export default function Profile (props) { 
   
    if (!user) {
      return null;
    }
  return (
    <React.Fragment>
      <div>
      {(user.role.includes('ROLE_PASSENGER') || user.role.includes('ROLE_SUPPORTSTAFF')) && (<ProfilePassenger/>)}
      </div>
      <div>
        {user.role.includes('ROLE_DRIVER') && <ProfileDriver/>}
      </div>      
      
    </React.Fragment>
  );
}
