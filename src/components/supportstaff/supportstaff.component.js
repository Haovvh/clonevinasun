import React, { useState, useEffect } from "react";
import userByPhoneService from "../../services/user-by-phone.service";
import StaffJourney from "./staffJourney.component";
import AuthService from "../../services/auth.service";
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
  
  const [message, setMessage] = useState("");
  const [hidden, setHidden] = useState(false)
  const [show, setShow] = useState(true)
  const [isSupportStaff, setIsSupportStaff] = useState(false)

  const [Info, setInfo] = useState({
    Phone: "",
    User_ID: "",
    Fullname: ""
  });

  const [NewInfo, setNewInfo] = useState({
    Phone: "",
    Fullname: "",
    Date_of_birth: new Date().toISOString().substring(0, 10)
  })
  const [places, setPlaces] = useState([])
  const [countPlace, setCountPlace]= useState([]);


  useEffect( () =>{
    if (user) {
      setIsSupportStaff(user.role.includes('ROLE_SUPPORTSTAFF')
      );
    }
  },[isSupportStaff] )

  const handleClick = () => {
    userByPhoneService.getUserbyPhone(Info.Phone).then(
      response => {
        if(response.data.resp) {
          console.log("Response True")
          console.log(response.data.data)
          console.log(response.data.address)
          setInfo(prevState => ({
            ...prevState,
            Fullname: response.data.data.Fullname,
            User_ID: response.data.data.User_ID
          }))
          setMessage(response.data.message)
          setHidden(true)
          console.log(Info.Fullname)
          console.log(Info.Phone)
          console.log(Info.User_ID)
          setPlaces(response.data.address)
          setCountPlace(response.data.count)
        }
        else {
          console.log("Response False")
          setMessage(response.data.message)
          
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
          setMessage(resMessage)
          localStorage.removeItem("user")
          alert("Vui lòng đăng nhập lại")
          window.location.assign("http://localhost:8082/login")                    
        })
        
        
  }
  const handleClickNewUSer = () => {
    userByPhoneService.postUser(NewInfo.Fullname, NewInfo.Phone, NewInfo.Date_of_birth).then(
      response => {
        console.log(response.data)
        if (response.data.resp) {
          console.log("True")
        } else {
          console.log("False")
        }
      }, error => {
        console.log(error);
      }
    )
  }
  

  const handlePhone =  (event) => {
    setInfo(prevState => ({
      ...prevState,
      Phone: event.target.value
    }))
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
        <div>
        <div className="form-group">
              <label htmlFor="phonecustomer">Phone User: </label>
              <input
                value={NewInfo.Phone}
                placeholder="Phone Customer"
                type="phone"
                className="form-control"
                onChange={(event) => setNewInfo(prevState => ({...prevState, Phone: event.target.value}))}
              />
            </div>
            <div className="form-group">
              <label htmlFor="phonecustomer">Tên người dùng: </label>
              <input
                value={NewInfo.Fullname}
                placeholder="Fullname"
                type="phone"
                className="form-control"
                onChange={(event) => setNewInfo(prevState => ({...prevState,Fullname: event.target.value}))}
              />
            </div>
            <div className="form-group">
              <label htmlFor="">Năm sinh: </label>
              <input
                value={NewInfo.Date_of_birth}
                placeholder="Năm sinh"
                type="date"
                className="form-control"
                onChange={(event) => setNewInfo(prevState => ({...prevState, Date_of_birth: event.target.value}))}
              />
            </div>

        </div>
        <div>        
          <button onClick={() => {handleClickNewUSer()}} >Thêm mới người dùng</button>
        </div>
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
                <button className="btn btn-primary btn-block" onClick={() => {handleClick()}}>
                  Show Customer</button>
              </div>
              {(hidden) ? (<div className="col-5" >
                <button className="btn btn-primary btn-block" onClick={() => setShow(!show)}>
                  {show ? "Hiện thông tin" :"Ẩn thông tin"}
                </button>
              </div>) : null}
              
            </div>
            {message && (
              <div className="form-group">
                <div className="alert alert-danger" role="alert">
                  {message}
                </div>
              </div>
            )}
            
          </div>
          <UserInfo show = {show}  places = {places} countPlace = {countPlace} Fullname={Info.Fullname}/>
          <StaffJourney place = {places} Info= {Info} show = {hidden}/> 
        </div>
      </React.Fragment>
      
    );
}
//