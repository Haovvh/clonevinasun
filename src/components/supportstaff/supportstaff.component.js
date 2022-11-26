import React, { useState, useEffect } from "react";
import userByPhoneService from "../../services/user-by-phone.service";
import StaffJourney from "./staffJourney.component";
import UserInfo from "./user-info.component";
import passengerService from "../../services/passenger.service";
import { URL_RELOAD } from "../../public/const";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';

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
  
  const [places, setPlaces] = useState([{
    origin_Fulladdress:"",
    Count: ""
  }])
  const [countPlace, setCountPlace]= useState([
    {
      start_time: "",
      origin_Fulladdress: "",
      destination_Fulladdress: ""
      
    }
  ]);

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
          window.location.assign(URL_RELOAD)
      }
    )
    
  },[])

  const handleClick = () => {
    userByPhoneService.getUserbyPhone(Info.Phone).then(
      response => {
        if(response.data.resp) {
          console.log(response.data)
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
          console.log(response)
                 
          setInfo(prevState => ({
            ...prevState,
            Fullname: response.data.data.Fullname,
            User_ID: response.data.data.User_ID
          }))
          setHidden(true)
        }                 
      },
      error => {
        alert("No User")
        window.location.reload();
        console.log(error)
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();            
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

        
          <div className="card-container">
          <InputGroup className="mb-3">
          <input
                value={Info.Phone}
                placeholder="Phone Customer"
                type="phone"
                className="form-control"
                onChange={(event) => { handlePhone(event) }}
              />
        <button  onClick={() => {handleClick()}} variant="btn btn-primary" id="button-addon2">
        Search
        </button>
        {hidden ? 
        <button  onClick={() => setShow(!show)} variant="btn btn-primary" id="button-addon2">
        {!show ? "Show" :"Hidden"}
        </button> : null}
      </InputGroup>
          </div>
        <div className="card-container">
          <div className="col-md-12">
            <StaffJourney place = {places} Info= {Info} show = {hidden}/> 
          </div>
          <UserInfo show = {show}  places = {places} countPlace = {countPlace} Fullname={Info.Fullname}/>          
        </div>
      </React.Fragment>      
    );
}