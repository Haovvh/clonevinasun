import React, { useState, useEffect } from "react";
import userByPhoneService from "../../services/user-by-phone.service";
import StaffJourney from "./staffJourney.component";
import UserInfo from "./user-info.component";
import passengerService from "../../services/passenger.service";


const required = value => {
  if (!value) {
    return (
      <div className="alert alert-danger" role="alert">
        This field is required!
      </div>
    );
  }
};

export default function SupportStaff () {  
  
  const [message, setMessage] = useState("");
  const [hidden, setHidden] = useState(false)
  const [show, setShow] = useState(true)
  const [SupportStaff, setSupportStaff] = useState({
    SupportStaff_ID: "",
    Fullname: "", 
    Phone: "",
    role: ""
  })

  const [Info, setInfo] = useState({
    Phone: "",
    User_ID: "",
    Fullname: ""
  });
  
  const [places, setPlaces] = useState([])
  const [countPlace, setCountPlace]= useState([]);

  useEffect( () =>{
    passengerService.getPassenger().then(
      response => {
        console.log(response.data.data)
        if(response.data.resp) {
          setSupportStaff(prevState => ({
            ...prevState,
            SupportStaff_ID: response.data.data.Passenger_ID,
            Fullname: response.data.data.Fullname, 
            Phone: response.data.data.Phone,
            role: response.data.data.role
          }))
        } else {
          setMessage(response.data.message)
        }
      }, error => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();  
          setMessage(resMessage)
          localStorage.removeItem("user");
          alert("Token is Expires. Please Login");
          window.location.assign("http://localhost:8088/login")
      }
    )
    
  },[])

  const handleClick = () => {
    userByPhoneService.getUserbyPhone(Info.Phone).then(
      response => {
        if(response.data.resp) {
          console.log("Response True")
          console.log(response.data.data)
          setInfo(prevState => ({
            ...prevState,
            Fullname: response.data.data.Fullname,
            User_ID: response.data.data.User_ID
          }))
          setHidden(true)
          setPlaces(response.data.address)
          setCountPlace(response.data.count)
        }
        else {
          console.log("Response False")
          setMessage(response.data.message)          
        }                 
      },
      error => {
        
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();  
          setMessage(resMessage)               
        })
  }  

  const handlePhone =  (event) => {
    setInfo(prevState => ({
      ...prevState,
      Phone: event.target.value
    }))
  }
  
    if(!SupportStaff.role.includes('ROLE_SUPPORTSTAFF')) {
      
      return null;
    }
 
    return (
      <React.Fragment>
        <div className="container">
        <header className="jumbotron">
          <h3>SupportStaff: {SupportStaff.Fullname} </h3>       
          <h3>Phone: {SupportStaff.Phone} </h3>     
          
        </header>
        </div>
        {message && (
              <div className="form-group">
                <div className="alert alert-danger" role="alert">
                  {message}
                </div>
              </div>
            )}

        <StaffJourney place = {places} Info= {Info} show = {hidden}/> 

        <div className="card-container">
          <div className="col-md-12">
            <div className="form-group">
              <label htmlFor="phonecustomer">Phone User: </label>
              <input
                value={Info.Phone}
                placeholder="Phone Customer"
                type="phone"
                className="form-control"
                onChange={(event) => { handlePhone(event) }}
              />
            </div>
            
            <div className="row">
              <div className="form-group col-5">
                <button className="btn btn-primary" onClick={() => {handleClick()}}>
                  Search</button>
              </div>
              {(hidden) ? (<div className="col-5" >
                <button className="btn btn-primary" onClick={() => setShow(!show)}>
                  {!show ? "Show" :"Hidden"}
                </button>
              </div>) : null}              
            </div>          
            
          </div>
          <UserInfo show = {show}  places = {places} countPlace = {countPlace} Fullname={Info.Fullname}/>          
        </div>
      </React.Fragment>      
    );
}