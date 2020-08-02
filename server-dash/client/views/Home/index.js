import React, { Component } from "react";
import { Meteor } from "meteor/meteor";
import { withTracker } from "meteor/react-meteor-data";

import Rooms from "../../models/Rooms";

import './Home.scss'





class HomePage extends Component
{
	
	render()
	{
		return (

			<div className=" home-container">
				<div className = "tableContainer">
					<table className = "infoTable">
						<tbody>
							<tr>
								<th>Name</th>
								<th>Attendance Status</th>
								<th>Tab Status</th>
								<th>Audio Status</th>
							</tr>
							
						</tbody>
					</table>
				</div>
			</div>
		);
	}
}

const HomePageContainer = withTracker(()=>
{
	return {
		
	};
})(HomePage)

export default HomePageContainer;