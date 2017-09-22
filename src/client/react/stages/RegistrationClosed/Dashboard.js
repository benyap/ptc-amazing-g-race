import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import Base from '../Base';


const mapStateToProps = (state, ownProps) => {
	return { 
		authenticated: state.auth.login.authenticated
	}
}

@connect(mapStateToProps)
class Dashboard extends React.Component {

	render() {
		if (!this.props.authenticated) {
			return <Redirect to={{
				pathname: '/login',
				state: { next: '/dashboard' }
			}}/>;
		}

		return (
			<div>
				<Base/>
				
			</div>
		);
	}
}


export default Dashboard;