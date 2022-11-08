import React from "react";
import "../../css/table.css"

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
            <div>
                <h1>Call History:</h1>
            </div>
            <div className="container totalTable">
                <div className="col-md-12">
                    <table>
                        <tbody>
                            <tr>
                                <th>Time:</th>
                                <th>Origin:</th>
                                <th>Destination:</th>
                            </tr>
                            {props.places.map((val, key) => {
                                return (
                                    <tr key={key}>
                                        <td className="col-3">{val.start_time}</td>
                                        <td className="col-3">{val.origin_Fulladdress}</td>
                                        <td className="col-3">{val.destination_Fulladdress}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
            <div>
                <h1>Place History:</h1>
            </div>
            <div className="container totalTable">
                <div className="col-md-12">
                    <table>
                        <tbody>
                            <tr>
                                <th>Place:</th>
                                <th>Count:</th>
                            </tr>
                            {props.countPlace.map((val, key) => {
                                return (
                                    <tr key={key}>
                                        <td className="col-3">{val.origin_Fulladdress}</td>
                                        <td className="col-3">{val.Count}</td>
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