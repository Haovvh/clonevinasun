import React, {useState} from "react";
import userByPhoneService from "../../services/user-by-phone.service";
import Input from "react-validation/build/input";
import Form from "react-validation/build/form";


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
        Date_of_birth: new Date().toISOString().substring(0, 10)
      })


    const handleClickNewUSer = () => {
        userByPhoneService.postUser(NewInfo.Fullname, NewInfo.Phone, NewInfo.Date_of_birth).then(
          response => {
            console.log(response.data)
            if (response.data.resp) {
              console.log("True")
              setMessage(response.data.message)
              setNewInfo({
                Fullname: "",
                Phone: "",
                Date_of_birth: ""
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
                <Form
                >
                <div className="form-group">
                    <label htmlFor="phoneuser">Phone User: </label>
                    <Input
                      value={NewInfo.Phone}
                      placeholder="Phone User"
                      type="phone"
                      className="form-control"
                      validations={[required]}
                      onChange={(event) => setNewInfo(prevState => ({...prevState, Phone: event.target.value}))}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="phonecustomer">FullName: </label>
                    <Input
                      value={NewInfo.Fullname}
                      placeholder="Fullname"
                      type="phone"
                      className="form-control"
                      validations={[required]}
                      onChange={(event) => setNewInfo(prevState => ({...prevState,Fullname: event.target.value}))}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="">Date of birth: </label>
                    <Input
                      value={NewInfo.Date_of_birth}
                      placeholder="Date of birth"
                      type="date"
                      className="form-control"
                      validations={[required]}
                      onChange={(event) => setNewInfo(prevState => ({...prevState, Date_of_birth: event.target.value}))}
                    />
                  </div>
                </Form>              
      
              </div>
              <div>        
                <button className="btn btn-primary" onClick={() => {handleClickNewUSer()}} >Create</button>
              </div>

    </React.Fragment>
    )
}
