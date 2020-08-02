import Schema from "simpl-schema";
import { Mongo } from "meteor/mongo";
import { string } from "prop-types";

const DataPacket = new Mongo.Collection("DataPacket");

DataPacket.schema = new Schema({
	
	
	serial: {
		type: Date,
		defaultValue: new Date()
	},

	userId : {
		type : String,
	},

	sessionId : {
		type : String,
	},

	onscreen: {
		type: Boolean,
		defaultValue:	true,
	},

	tabstatus: {
		type: Boolean,
		defaultValue:	true
	},

	decibelLevel: {
		type: Number,
		defaultValue:	0
	},
})

DataPacket.attachSchema(DataPacket.schema);

export default DataPacket;