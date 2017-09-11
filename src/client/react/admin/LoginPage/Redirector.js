import React from 'react';
import { Redirect } from 'react-router-dom';


class Redirector extends React.Component {
	render() {
		if (this.props.authenticated) {
			return <Redirect to='/admin/dashboard'/>;
		}
		else return null;
	}
}


export default Redirector;
