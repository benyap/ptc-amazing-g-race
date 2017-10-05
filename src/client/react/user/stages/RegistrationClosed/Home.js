import React from 'react';
import { connect } from 'react-redux';
import { graphql } from 'react-apollo';
import { Link } from 'react-router-dom';
import { getUserByEmail } from '../../../../graphql/user';
import Title from '../../components/Title';
import Description2 from '../../components/Description2';
import ScrollAnimation from 'react-animate-on-scroll';

import '../../../scss/components/_registration-closed.scss';


const mapStateToProps = (state, ownProps) => {
	return { 
		authenticated: state.auth.login.authenticated,
		email: state.auth.login.email
	}
}

const QueryMeOptions = {
	name: 'QueryMe',
	options: ({email}) => ({ variables: {email} }),
	skip: (ownProps) => !ownProps.authenticated
}

@connect(mapStateToProps)
@graphql(getUserByEmail('firstname lastname username'), QueryMeOptions)
class Home extends React.Component {
	render() {
		let name;

		if (this.props.authenticated) {
			name = this.props.QueryMe.loading ? '!' : ', ' + this.props.QueryMe.getUserByEmail.firstname + '!';
		}
		
		return (
			<main id='registration-closed'>
				<Title/>
				<ScrollAnimation animateOnce animateIn='fadeIn' offset={0}>
					{ this.props.authenticated ?
						<div className='closed'>
							<h3>Welcome{name}</h3>
							<Link to='/dashboard' className='pt-button pt-intent-primary pt-large pt-fill login-button'>
								Go to my dashboard
							</Link>
							<Link to='/pay' className='pt-button pt-minimal pt-large pt-fill pt-intent-primary login-button'>
								How do I pay?
							</Link>
						</div>
						:
						<div className='closed'>
							<h3>Registration is now closed.</h3>
							<Link to='/login' className='pt-button pt-intent-primary pt-large pt-fill login-button'>
								Login
							</Link>
							<Link to='/pay' className='pt-button pt-minimal pt-large pt-fill pt-intent-primary login-button'>
								How do I pay?
							</Link>
						</div>
					}
				</ScrollAnimation>
				<Description2/>
			</main>
		);
	}
}


export default Home;
