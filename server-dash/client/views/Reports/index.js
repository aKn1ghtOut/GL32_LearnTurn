import React, { Component } from "react";
import { Meteor } from "meteor/meteor";
import { withTracker } from "meteor/react-meteor-data";

import Rooms from "../../models/Rooms";

import './Reports.scss'

import ListProductsContainer from "../../components/ListProducts";
import Sessions from "../../models/Sessions";
import RTStatus from "../../models/RTStatus";
import HomeTable from "../../components/HomeTable";

import DataPacket from "../../models/DataPacket";





class report extends Component
{
	
	render()
	{
		return (

			<div className=" report-container">
				<div className="tableCon">
					<table className = "data-table">
						<tbody>
							<tr>
								<th>Name</th>
								<th>Tab Status</th>
								<th>Looking</th>
								<th>Audio Level</th>
								<th>Time</th>
							</tr>
							{
								this.props.loading ? null :
								this.props.data.map(el =>{
									if(el.userId == Meteor.userId()){
									<tr>
										<td>moksh</td>
										<td>{el.tabstatus? "Yes" : "No"}</td>
										<td>{el.onscreen? "Yes" : "No"}</td>
										<td>{el.decibelLevel * 1000}</td>
										<td>{el.serial.toLocaleString() }</td>
									</tr>
									}
								})
							}
						</tbody>
					</table>
				</div>
			</div>
		)
	}
}

const reportContainer = withTracker( (props) => {

	const data = Meteor.subscribe('dataPackets.get');
	const loading = data.ready() ? false : true ;
	return {
		loading,
		data : loading || DataPacket.find({}).fetch()
	};

})(report);

export default reportContainer;