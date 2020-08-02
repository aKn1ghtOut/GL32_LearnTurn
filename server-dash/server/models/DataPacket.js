import Schema from "simpl-schema";
import { Mongo } from "meteor/mongo";

const DataPacket = new Mongo.Collection("DataPacket");

DataPacket.schema = new Schema({
	
	
	serial: {
		type: Number,
		defaultValue: new Date()
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