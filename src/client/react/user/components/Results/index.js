import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import Base from '../../components/Base';
import PostRaceMenu from '../../components/menus/PostRaceMenu';
import HideResults from './HideResults';
import ShowResults from './ShowResults';

import '../../scss/views/_main.scss';


const mapStateToProps = (state, ownProps) => {
	return { 
		authenticated: state.auth.login.authenticated
	}
}

@connect(mapStateToProps)
class Results extends React.Component {
	static propTypes = {
		showResults: PropTypes.bool.isRequired
	}
	
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
						{ this.props.showResults ? 
							<ShowResults/> : <HideResults/>
						}
					</div>
				</main>
			</div>
		);
	}
}


export default Results;
