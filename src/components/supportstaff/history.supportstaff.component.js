import React, {useEffect, useState} from "react";
import journeyService from "../../services/journey.service";
import '../../css/table.css'

export default function HistorySupportStaff () {
    const [Info, setInfo] = useState([])   

    useEffect ( () => {
        journeyService.getAllJourneybysupportstaffID().then(
            response => {
                if(response.data.resp) {
                  console.log("Có Data")
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
            <h3>History SupportStaff</h3>
          </header>
          <div className="container totalTable">
                <div className="col-md-12">
                    <table>
                        <tbody>
                            <tr>
                                <th>Fullname Driver:</th>
                                <th>Fullname User:</th>
                                <th>Orgin:</th>
                                <th>Destination:</th>
                                <th>Price:</th>
                                <th>Distance:</th>
                                <th>StartTime:</th>
                                <th>endTime:</th>
                            </tr>
                            {Info.map((val, key) => {
                                return (
                                    <tr key={key}>
                                        <td >{val.FullnameDriver}</td>
                                        <td >{val.FullnameUser}</td>
                                        <td >{val.origin_Fulladdress}</td>
                                        <td >{val.destination_Fulladdress}</td>
                                        <td >{val.Price}</td>
                                        <td >{val.distance_km}</td>
                                        <td >{val.start_time}</td>
                                        <td >{val.finish_time}</td>
                                    </tr>
                                )
                            })}
                            
                        </tbody>
                    </table>
                </div>
            </div>
          </div>
          </React.Fragment>
    )
}