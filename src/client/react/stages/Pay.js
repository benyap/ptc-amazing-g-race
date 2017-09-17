import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { graphql, gql } from 'react-apollo';
import ScrollAnimation from 'react-animate-on-scroll';
import Title from './Title';

import '../scss/_pay.scss';


const mapStateToProps = (state, ownProps) => {
	return { 
		authenticated: state.auth.login.authenticated,
		email: state.auth.login.email
	}
}


const QueryMe = gql`
query GetMe {
  getMe {
    username 
  }
}`;

const QueryMeOptions = {
	name: 'QueryMe',
	options: (props) => ({
		variables: { email: props.email }
	}),
	skip: (ownProps) => {
		return !ownProps.authenticated;
	}
}

@connect(mapStateToProps)
@graphql(QueryMe, QueryMeOptions)
class Pay extends React.Component {
	
	render() {
		let payment; 
		if (this.props.authenticated) {
			let reference = 'AGR-<your username>';
			if (!this.props.QueryMe.loading) {
				reference = `AGR-${this.props.QueryMe.getMe.username}`;
			}

			payment = (
				<div className='payment-details'>
					<p>
						BSB: 000-000
						<br/>
						ACC: 0000-0000
					</p>
					<p>
						Please use <span className='highlight'>{reference}</span> as the payee reference.
					</p>
				</div>
			);
		}
		else {
			payment = (
				<div className='payment-details'>
					<p>
						Please <Link to={{
							pathname: '/login',
							state: {
								next: '/pay'
							}
						}}>log in</Link> to view payment details.
					</p>
				</div>
			);
		}

		return (
			<main id='pay'>
				<Title/>
					<ScrollAnimation animateOnce animateIn='fadeInUp' offset={0} duration={0.5}>
					<div className='infobox'>
						<h2>
							Payment details
						</h2>
						<p>
							The cost for this event is <span className='highlight'>$15</span>,
							which pays for registration and dinner.
						</p>
						<p>
							Please note that you will need to buy your own lunch and 
							utilise Public Transport on the day,
							which is <b>NOT</b> covered by the cost.
						</p>
						{payment}
					</div>
				</ScrollAnimation>
			</main>
		);
	}
}


export default Pay;
