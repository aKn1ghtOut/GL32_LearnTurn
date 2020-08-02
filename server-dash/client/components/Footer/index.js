import React, { Component } from "react";

import { withRouter } from "react-router";

import "./Footer.scss";

class Header extends Component
{
	constructor(props)
	{
		super(props);
	}

	state = {
	};

	render()
	{
		return (
		<div className="container-fluid" id="footer_area">
			Copyright Campus-Kart 2020
		</div>
		);
	}
}

export default withRouter(Header);