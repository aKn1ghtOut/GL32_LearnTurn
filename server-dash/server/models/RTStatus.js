import Schema from "simpl-schema";
import { Mongo } from "meteor/mongo";
import { string } from "prop-types";

const RTStatus = new Mongo.Collection("RTStatus");

RTStatus.schema = new Schema({

	userId: {
		type : String,
	},

	username: {
		type : String,
	},

	sessionId: {
		type : String,
	},

	datetime: {
		type: Date,
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

	attentionStatus: {
		type: Boolean,
		defaultValue:	true,
	},

	decibelLevel: {
		type: Number,
		defaultValue:	0
	},

	attentionQuotient: {
		type: Number
	},

	joinedAt: {
		type: Date,
		defaultValue: new Date()
	},

	
})

RTStatus.attachSchema(RTStatus.schema);

export default RTStatus;