import { Accounts } from "meteor/accounts-base";
import { _ } from "meteor/underscore";

Accounts.onCreateUser((options, user) => {
	const { name, type } = options;
	Object.assign(user, { name, type
	});

	return user;

	console.log(Meteor.user())
});