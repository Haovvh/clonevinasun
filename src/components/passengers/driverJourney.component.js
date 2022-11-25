import React from "react";

const required = value => {
    if (!value) {
      return (
        <div className="alert alert-danger" role="alert">
          This field is required!
        </div>
      );
    }
  };

export default function DriverJourney(props) {
    
    if (!(props.info.Phone  && props.info.Fullname && props.info.Car_code )) {
        return null;
    }   
    return (
        <React.Fragment>
            <div  className=" card-container">
                <div className=" col-md-12">
                    <div className="form-group">
                        <label htmlFor="username">Driver</label>
                        <input
                            type="text"
                            className="form-control"
                            value={props.info.Fullname}
                            disabled
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="username">Phone</label>
                        <input
                            type="phone"
                            className="form-control"
                            value={props.info.Phone}
                            disabled
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="username">Car Code</label>
                        <input
                            type="text"
                            className="form-control"
                            value={props.info.Car_code}
                            disabled
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="">Car Info</label>
                        <input
                            type="text"
                            className="form-control"
                            value={props.info.Car_type + " " + props.info.Car_color}
                            disabled
                        />
                    </div>         
                </div>
            </div>
        </React.Fragment>
    )
}
