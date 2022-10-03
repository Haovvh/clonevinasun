import React, { Component } from "react";

import UserService from "../services/user.service";

import GoongMap from "../Goong/GoongMap";

export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      content: ""
    };
  }

  componentDidMount() {
    UserService.getPublicContent().then(
      response => {
        this.setState({
          content: response.data
        });
      },
      error => {
        this.setState({
          content:
            (error.response && error.response.data) ||
            error.message ||
            error.toString()
        });
      }
    );
  }

  render() {
    return (
      <div className="container ">
        <div className="col">
          <header className="jumbotron">
            <h3>{this.state.content}</h3>
          </header>
          </div>
        <div className="col">
          <GoongMap/>
        </div>
       
        
      </div>
    );
  }
}
