import React from 'react';
import PropTypes from 'prop-types';
import autobind from 'core-decorators/es/autobind';
import { connect } from 'react-redux';
import { graphql } from 'react-apollo';
import { Spinner } from '@blueprintjs/core';
import { getUserByEmail } from '../../../../graphql/user';
import TeamPointsPanel from './TeamPointsPanel';

import '../../scss/views/_main.scss'
import '../../scss/views/_home.scss';


const mapStateToProps = (state, ownProps) => {
	return { email: state.auth.login.email };
}

const QueryGetUserOptions = {
	name: 'QueryGetUser',
	options: (props) => {
		return {
			fetchPolicy: 'cache-and-network',
			variables: { email: props.email }
		}
	}
}

@connect(mapStateToProps)
@graphql(getUserByEmail('_id firstname teamId'), QueryGetUserOptions)
@autobind
class Home extends React.Component {
	static propTypes = {
		email: PropTypes.string
	}
	
	render() {
		const { loading, getUserByEmail: user } = this.props.QueryGetUser;
		let teamPointsPanel;

		if (user) {
			teamPointsPanel = <TeamPointsPanel user={user}/>;
		}
		else {
			teamPointsPanel = (
				<div style={{textAlign:'center',margin:'3rem'}}>
					<Spinner className='pt-large'/>
				</div>
			);
		}

		return (
			<main id='home' className='dashboard'>
				<div className='content'>
					{teamPointsPanel}
				</div>
			</main>
		);
	}
}


export default Home;
