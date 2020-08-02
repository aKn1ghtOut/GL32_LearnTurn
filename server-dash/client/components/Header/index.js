import React, { Component } from "react";

import { withRouter } from "react-router";

import "./Header.scss";
import { Link } from "react-router-dom";

class Header extends Component {
  
  render() {
    return (
      <nav className="custom-nav">
        <div className="logo">
          <Link className="brand-logo" to="/home">
            <img src="/logo/logo_lt.png" className="logo" alt="Logo"/>
          </Link>
        </div>

        <div className="heading">
         <h1>INSTRUCTOR'S DASHBOARD</h1>
        </div>
        
      </nav>


    );
  }
}

export default withRouter(Header);
