import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import { withTracker } from "meteor/react-meteor-data";

import { Router, Route, Switch } from "react-router-dom";
import { createBrowserHistory } from "history";

import { Accounts } from "meteor/accounts-base";

import "./main.scss";

import LoginForm  from "./components/LoginForm"


const appHistory = createBrowserHistory();

const App = () => {

	if(!Meteor.userId()){
		return <LoginForm />
	}

	else {
		console.log('Logged In')
		return(
		<Router history={appHistory}>
			
		</Router>
		)
	}
};


const AppContainer = withTracker(()=>
{
	const session = Meteor.subscribe("Users.get");

	return {
		
	};
})(App)

Meteor.startup(() => {


	Accounts.createUser({
		username: 'learnturn',
		password: 'password'
	});
	
	render(<AppContainer/>, document.getElementById('container'));
	
	
});
