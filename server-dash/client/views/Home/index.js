import React, { Component } from "react";
import { Meteor } from "meteor/meteor";
import { withTracker } from "meteor/react-meteor-data";

import Rooms from "../../models/Rooms";

import './Home.scss'

import ListProductsContainer from "../../components/ListProducts";
import Sessions from "../../models/Sessions";
import RTStatus from "../../models/RTStatus";





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
							{/* {
								this.props.loading ? null :
								this.props.details.map(el => {
									<tr>
										<td>{el.user.name}</td>
										<td><div className={`col-${el.attentionStatus}`}></div></td>
										<td><div className={`col-${el.tabstatus}`}></div></td>
										<td><div className={el.decibelLevel}></div></td>
									</tr>
								}) 
							} */}
						</tbody>
					</table>
				</div>
			</div>
		);
	}
}

const HomePageContainer = withTracker(()=>
{
	// const subscription = Meteor.subscribe("HomeAttentionDetails.get");
	// var loading = !subscription.ready();
	// const sessionActive = Sessions.find({status: true, owner: {uid : Meteor.userId()}})

	return {
		// loading,
		// details: loading || RTStatus.find({sessionId : sessionActive})
	};
})(HomePage)

export default HomePageContainer;