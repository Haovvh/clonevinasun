import React, { useState } from "react";

export default function AcceptJourney(props) {
    const [theRideComplete, setTheRideComplete] = useState(true)
    
    if (props.isTrips === "Offline") {
        return null;
    }
    return (
        <React.Fragment>
            <div className="card card-container">
                <div className=" col-md-12">
                    <div className="form-group">
                        <label htmlFor="username">Họ tên khách:</label>
                        <input
                            type="text"
                            className="form-control"
                            value={props.info.name}
                            disabled
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="username">SDT:</label>
                        <input
                            type="text"
                            className="form-control"
                            value={props.info.sdt}
                            disabled
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="username">Điểm đón:</label>
                        <input
                            type="text"
                            className="form-control"
                            value={props.info.placeFrom}
                            disabled
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="">Điểm đến:</label>
                        <input
                            placeholder="Điểm đến"
                            type="text"
                            className="form-control"
                            value={props.info.placeTo}
                            disabled
                        />
                    </div>
                    <button className="btn btn-primary btn-block"
                        onClick={() => { setTheRideComplete(!theRideComplete) }}>
                        Accept Trips
                    </button>
                </div>
            </div>
        </React.Fragment>
    )
}
