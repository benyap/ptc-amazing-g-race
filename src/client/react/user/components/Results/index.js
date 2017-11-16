import React from 'react';
import { Route } from 'react-router-dom';
import { connect } from 'react-redux';
import { Switch, Redirect } from 'react-router-dom';
import Base from '../../components/Base';
import PostRaceMenu from '../../components/menus/PostRaceMenu';

import '../../scss/views/_main.scss';


const mapStateToProps = (state, ownProps) => {
	return { 
		authenticated: state.auth.login.authenticated
	}
}

@connect(mapStateToProps)
class Results extends React.Component {

	render() {
		if (!this.props.authenticated) {
			return <Redirect to={{
				pathname: '/login',
				state: { next: '/results' }
			}}/>;
		}

		return (
			<div className='pt-dark'>
				<Base/>
				<PostRaceMenu/>
				<main id='dashboard-home' className='dashboard'>
					<div className='content'>
						<h2 style={{textAlign:'center'}}>Results</h2>

					</div>
				</main>
			</div>
		);
	}
}


export default Results;
