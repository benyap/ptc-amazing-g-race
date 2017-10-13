import React from 'react';
import PropTypes from 'prop-types';
import autobind from 'core-decorators/es/autobind';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { graphql } from 'react-apollo';
import { Spinner } from '@blueprintjs/core';
import { getUserByEmail } from '../../../../graphql/user';
import TeamPanel from './TeamPanel';

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

		let content = (
			<div style={{textAlign:'center',margin:'3rem'}}>
				<Spinner className='pt-large'/>
			</div>
		);

		if (user) {
			content = <TeamPanel user={user}/>;
		}

		return (
			<main id='home' className='dashboard'>
				<div className='content'>
					{content}
					<h5>Important contacts</h5>
					<p>
						Go to the <Link to='/dashboard/help'>help page</Link> for important contact details.
					</p>
				</div>
			</main>
		);
	}
}


export default Home;
