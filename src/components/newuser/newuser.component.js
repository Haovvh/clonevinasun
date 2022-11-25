import React, {useState} from "react";
import userByPhoneService from "../../services/user-by-phone.service";


const required = value => {
  if (!value) {
    return (
      <div className="alert alert-danger" role="alert">
        This field is required!
      </div>
    );
  }
};

export default function NewUser () {
    const [message, setMessage] = useState("");
    const [NewInfo, setNewInfo] = useState({
        Phone: "",
        Fullname: "",
        Date_of_birth: new Date().toISOString().substring(0, 10),
        gender: "male"
      })


    const handleClickNewUSer = () => {
        userByPhoneService.postUser(NewInfo.Fullname, NewInfo.Phone, NewInfo.Date_of_birth, NewInfo.gender).then(
          response => {
            console.log(response.data)
            if (response.data.resp) {
              alert("Create User Success")
              
              setNewInfo({
                Fullname: "",
                Phone: "",
                Date_of_birth: new Date().toISOString().substring(0, 10)
              })
            } else {
              console.log("False")
              setMessage(response.data.message)
            }
          }, error => {
            console.log(error);
          }
        )
      }

    return (
            <React.Fragment>
              <div className="container">
              <header className="jumbotron">
                <h3>SupportStaff</h3> 
              </header>
              </div>
              {message && (
                    <div className="form-group">
                      <div className="alert alert-danger" role="alert">
                        {message}
                      </div>
                    </div>
                  )}
              <div>
                
                <div className="form-group">
                    <label htmlFor="phoneuser">Phone User </label>
                    <input
                      value={NewInfo.Phone}
                      placeholder="Phone User"
                      type="phone"
                      className="form-control"
                      validations={[required]}
                      onChange={(event) => setNewInfo(prevState => ({...prevState, Phone: event.target.value}))}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="phonecustomer">FullName </label>
                    <input
                      value={NewInfo.Fullname}
                      placeholder="Fullname"
                      type="phone"
                      className="form-control"
                      validations={[required]}
                      onChange={(event) => setNewInfo(prevState => ({...prevState,Fullname: event.target.value}))}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="">Date of birth </label>
                    <input
                      value={NewInfo.Date_of_birth}
                      placeholder="Date of birth"
                      type="date"
                      className="form-control"
                      validations={[required]}
                      onChange={(event) => setNewInfo(prevState => ({...prevState, Date_of_birth: event.target.value}))}
                    />
                  </div> 
                  <div className="form-group">
                        <select value={NewInfo.gender} 
                        onChange={(event) => setNewInfo(prevState => ({...prevState, gender: event.target.value}))}>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                        </select>
                    </div>               
      
              </div>
              <div>        
                <button className="btn btn-primary" onClick={() => {handleClickNewUSer()}} >Create</button>
              </div>

    </React.Fragment>
    )
}
