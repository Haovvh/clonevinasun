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
                        <label htmlFor="username">Họ tên khách:</label>
                        <input
                            type="text"
                            className="form-control"
                            value={props.info.Fullname}
                            disabled
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="username">SDT:</label>
                        <input
                            type="text"
                            className="form-control"
                            value={props.info.Phone}
                            disabled
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="username">Điểm đón:</label>
                        <input
                            type="text"
                            className="form-control"
                            value={props.info.origin_Fulladdress}
                            disabled
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="">Điểm đến:</label>
                        <input
                            type="text"
                            className="form-control"
                            value={props.info.destination_Fulladdress}
                            disabled
                        />
                    </div>    
                    <div className="form-group">
                        <label htmlFor="">Thành Tiền:</label>
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
