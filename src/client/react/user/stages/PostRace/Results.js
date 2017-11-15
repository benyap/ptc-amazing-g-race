import React from 'react';
import { Route } from 'react-router-dom';
import { connect } from 'react-redux';
import { Switch, Redirect } from 'react-router-dom';
import Base from '../../components/Base';



const mapStateToProps = (state, ownProps) => {
	return { 
		authenticated: state.auth.login.authenticated
	}
}

@connect(mapStateToProps)
class Results extends React.Component {

	render() {
		if (!this.props.authenticated) {
			return <Redirect to='/'/>;
		}

		return (
			<div className='pt-dark'>
				<Base/>
			</div>
		);
	}
}


export default Results;
