import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Spinner } from '@blueprintjs/core';
import { compose, graphql, gql } from 'react-apollo';
import ScrollAnimation from 'react-animate-on-scroll';
import Title from './Title';
import LoginRefresher from '../sharedComponents/LoginRefresher';

import '../scss/_pay.scss';


const mapStateToProps = (state, ownProps) => {
	return { 
		authenticated: state.auth.login.authenticated,
		email: state.auth.login.email,
		refresh: state.auth.tokens.refresh
	}
}

const QueryMe = gql`
query GetUserByEmail($email:String!) {
  getUserByEmail(email:$email) {
		firstname
		lastname
		username 
  }
}`;

const QueryMeOptions = {
	name: 'QueryMe',
	options: ({email}) => ({
		variables: {email}
	}),
	skip: (ownProps) => {
		return !ownProps.authenticated;
	}
}

const QuerySetting = gql`
query GetSetting($key:String!){
  getSetting(key:$key){
		value
	}
}`;

const PaymentQueryOptions = (name, key) => {
	return {
		name,
		options: (props) => ({
			variables: { key }
		}),
		skip: (ownProps) => {
			return !ownProps.authenticated;
		}
	}
}

@connect(mapStateToProps)
@compose(
	graphql(QueryMe, QueryMeOptions),
	graphql(QuerySetting, PaymentQueryOptions('QueryBsb', 'payment_bsb')),
	graphql(QuerySetting, PaymentQueryOptions('QueryAcc', 'payment_acc'))
)
class Pay extends React.Component {
	
	render() {
		let payment; 

		if (this.props.authenticated) {
			let reference = <Spinner className='pt-small'/>;
			if (!this.props.QueryMe.loading) {
				reference = `AGR-${this.props.QueryMe.getUserByEmail.username}`;
			}

			payment = (
				<div className='payment-details'>
					<p>
						BSB: {this.props.QueryBsb.loading ? 'Loading...' : this.props.QueryBsb.getSetting.value}
						<br/>
						ACC: {this.props.QueryAcc.loading ? 'Loading...' : this.props.QueryAcc.getSetting.value}
					</p>
						Please use <span className='highlight'>{reference}</span> as the payee reference.
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
				<LoginRefresher refreshToken={this.props.refresh}/>
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
