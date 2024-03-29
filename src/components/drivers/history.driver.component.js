import React, {useEffect, useState} from "react";
import journeyService from "../../services/journey.service";
import "../../App.css"

export default function HistoryDriver () {
    const [Info, setInfo] = useState([{
      Fullname:"",
      origin_Fulladdress:"",
      destination_Fulladdress: "",
      Price: "",
      start_time: ""
    }])
    
    useEffect ( () => {
        journeyService.getAllJourneybydriverID().then(
            response => {
                if(response.data.resp) {
                  const user = response.data.data;
                  setInfo(response.data.data)
                  console.log(user)
                  
                } else {
                    
                }
                       
              },
              error => {
                const resMessage =
                  (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                  error.message ||
                  error.toString(error.response.data.message);
                        
                }
        )

    }, [])

    return (
        <React.Fragment>
        <div className="card container">
          <header className="jumbotron">
            <h3>
                History Driver
            </h3>
            
          </header>
          <div className="container">
            
                    <table>
                      <thead>
                      <tr>
                                <th className="col">Full name</th>
                                <th className="col">Orgin</th>
                                <th className="col">Destination</th>
                                <th className="col">Price</th>
                                <th className="col">StartTime</th>
                            </tr>
                      </thead>
                        <tbody>
                            
                            {Info.map((val, key) => {
                                return (
                                    <tr key={key}>
                                        <td data-label="Fullname" >{val.Fullname}</td>
                                        <td data-label="Orgin">{val.origin_Fulladdress}</td>
                                        <td data-label="Destination">{val.destination_Fulladdress}</td>
                                        <td data-label="Price">{val.Price}</td>
                                        <td data-label="StartTime">{val.start_time}</td>
                                    </tr>
                                )
                            })}
                            
                        </tbody>
                    </table>
                </div>
          </div>
          <div>   

</div>
          </React.Fragment>
    )
}