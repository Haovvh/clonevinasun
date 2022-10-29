import React, { useState, useEffect } from "react";
import userByPhoneService from "../../services/user-by-phone.service";
import StaffJourney from "./staffJourney.component";
import EventBus from "../../common/EventBus";
import AuthService from "../../services/auth.service";
import CustomerInfo from "../customer-info.component";
import UserInfo from "./user-info.component";


const required = value => {
  if (!value) {
    return (
      <div className="alert alert-danger" role="alert">
        This field is required!
      </div>
    );
  }
};
const user = AuthService.getCurrentUser();

export default function SupportStaff () {  
  
  const [isSupportStaff, setIsSupportStaff] = useState(false)

  const [Info, setInfo] = useState({
    Phone: "",
    User_ID: "",
    Fullname: ""
  });
  const [Phone, setPhone] = useState();
  const [Fullname, setFullname] = useState("");
  const [User_ID, setUser_ID]= useState();
  const [places, setPlaces] = useState([])
  const [countPlace, setCountPlace]= useState([]);
  const [status, setStatus] = useState("getCustomer")


  useEffect( () =>{
    if (user) {
      setIsSupportStaff(user.role.includes('ROLE_SUPPORTSTAFF')
      );
    }
  },[isSupportStaff] )

  const handleClick = () => {
    userByPhoneService.getUserbyPhone(Phone).then(
      response => {
        if(response.data.resp) {
          console.log("Response True")
          console.log(response.data.data)
          console.log(response.data.address)
          setInfo({
            Fullname: response.data.data.Fullname,
            User_ID: response.data.data.User_ID
          })
          setFullname(response.data.data.Fullname)
          setUser_ID(response.data.data.User_ID)
          
          setPlaces(response.data.address)
          setCountPlace(response.data.count)
        }
        else {
          console.log("Response False")
          
        }
                 
      },
      error => {
        console.log("Error")
        console.log(error)
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
            console.log(error)                    
        })
  }
  

  const handlePhone =  (event) => {
    setInfo({Phone: event.target.value})
    setPhone(event.target.value)
    //setUserInfo({Phone: event.target.value})
  }
  
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
                value={Phone}
                placeholder="Phone Customer"
                type="phone"
                className="form-control"
                onChange={(event) => { handlePhone(event) }}
              />
            </div>
            <div className="form-group">
              <button className="btn btn-primary btn-block" onClick={() => {handleClick()}}>
                {status === "getCustomer" ? 'Show Customer' : ((status === "bookdriver") ? "Book Driver" : "Complete")}</button>
            </div>
          </div>
          <UserInfo  places = {places} countPlace = {countPlace} Fullname={Info.Fullname}/>
          <StaffJourney place = {places} Info= {Info}/> 
        </div>
      </React.Fragment>
      
    );
}
//