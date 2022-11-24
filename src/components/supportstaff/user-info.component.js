import React from "react";
import "../../App.css"

export default function UserInfo(props) {

    if ((props.Fullname === "")) {
        return null;
    }
    return (
        <React.Fragment>
            {!props.show ? 
            null : 
            (<div>
                <div className="container">
                <div className="col-md-12">
                    <div className="form-group">
                        <label htmlFor="name">FullName: </label>   
                        <input
                            type="text"
                            value={props.Fullname}
                            className="form-control"
                            disabled
                        />
                    </div>                    
                </div>
            </div>
            
            <div className="container totalTable">
                <div className="col-md-12">
                <div>
                <h3>Call History</h3>
            </div>
                <table>
                      <thead>
                      <tr>
                                <th className="col">Time</th>
                                <th className="col">Origin</th>
                                <th className="col">Destination</th>
                            </tr>
                      </thead>
                        <tbody>
                            
                            {props.countPlace.map((val, key) => {
                                return (
                                    <tr key={key}>
                                        <td data-label="Time" >{val.start_time}</td>
                                        <td data-label="Origin">{val.origin_Fulladdress}</td>
                                        <td data-label="Destination">{val.destination_Fulladdress}</td>
                                    </tr>
                                )
                            })}
                            
                        </tbody>
                    </table>
                    
                </div>
            </div>
            <div className="container totalTable">
                <div className="col-md-12">
                    <div>
                    <h3>Place History</h3>
                    </div>
                
                <table>
                      <thead>
                      <tr>
                                <th className="col">Place</th>
                                <th className="col">Count</th>
                            </tr>
                      </thead>
                        <tbody>
                            
                            {props.countPlace.map((val, key) => {
                                return (
                                    <tr key={key}>
                                        <td data-label="Place" >{val.origin_Fulladdress}</td>
                                        <td data-label="Count">{val.Count}</td>
                                    </tr>
                                )
                            })}
                            
                        </tbody>
                    </table>
                    
                </div>
            </div>
            </div>)}
            
        </React.Fragment>
    );
}