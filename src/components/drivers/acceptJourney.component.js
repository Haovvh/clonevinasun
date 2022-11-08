import React from "react";

  
export default function AcceptJourney(props) {
    
    if (!props.info.origin_Fulladdress) {
        return <React.Fragment>

        </React.Fragment>
       
    }
    return (
        <React.Fragment>
            
            <div className=" card-container">
                <div className=" col-md-12">
                    <div className="form-group">
                        <label htmlFor="username">FullName Passenger:</label>
                        <input
                            type="text"
                            className="form-control"
                            value={props.info.Fullname}
                            disabled
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="username">Phone:</label>
                        <input
                            type="text"
                            className="form-control"
                            value={props.info.Phone}
                            disabled
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="username">Origin:</label>
                        <input
                            type="text"
                            className="form-control"
                            value={props.info.origin_Fulladdress}
                            disabled
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="">Destination:</label>
                        <input
                            type="text"
                            className="form-control"
                            value={props.info.destination_Fulladdress}
                            disabled
                        />
                    </div>    
                    <div className="form-group">
                        <label htmlFor="">Total Money:</label>
                        <input
                            type="text"
                            className="form-control"
                            value={props.info.Price + " VND"}
                            disabled
                        />
                    </div>                 
                </div>
            </div>
        </React.Fragment>
    )
}
