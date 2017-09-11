import React from 'react';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';


class Kick extends React.Component {
	render() {
		if (!this.props.authenticated) {
			return <Redirect to='/admin'/>
		}
		else return null;
	}
}


export default Kick;
