import Schema from "simpl-schema";
import { Mongo } from "meteor/mongo";
import { string } from "prop-types";

const RTStatus = new Mongo.Collection("RTStatus");

RTStatus.schema = new Schema({

	userId: {
		type : String,
	},

	email: {
		type : String,
	},

	sessionId: {
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

	attentionQuotient: {
		type: Number
	},

	joinedAt: {
		type: Date,
		defaultValue: new Date()
	},

	
	mouthOpen : {
		type : Boolean,
		defaultValue : false
	},

	randomCheck : {
		type : Number,
	},

	presence : {
		type : Boolean,
		defaultValue: true
	},

	drowsy : {
		type : Boolean,
		defaultValue : false,
	}
	
})

RTStatus.attachSchema(RTStatus.schema);

export default RTStatus;