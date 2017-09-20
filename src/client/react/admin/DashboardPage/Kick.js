import React from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';


class Kick extends React.Component {
	render() {
		if (!this.props.authenticated) {
			return <Redirect to={{
				pathname:'/admin',
				state: { origin: this.props.origin }
			}}/>;
		}
		else return null;
	}
}


export default Kick;
