import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Spinner } from '@blueprintjs/core';
import { compose, graphql, gql } from 'react-apollo';
import ScrollAnimation from 'react-animate-on-scroll';
import Title from './Title';
import LoginRefresher from '../../sharedComponents/LoginRefresher';

import '../../scss/_pay.scss';


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
query GetProtectedSetting($key:String!){
  getProtectedSetting(key:$key){
		value
	}
}`;

const QueryPublicSetting = gql`
query GetPublicSetting($key:String!){
  getPublicSetting(key:$key){
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

const QueryPaymentPriceOptions = {
	name: 'QueryPaymentPrice',
	options: {
		fetchPolicy: 'network-only',
		variables: { key: 'payment_amount' }
	}
}

@connect(mapStateToProps)
@compose(
	graphql(QueryMe, QueryMeOptions),
	graphql(QueryPublicSetting, QueryPaymentPriceOptions),
	graphql(QuerySetting, PaymentQueryOptions('QueryBsb', 'payment_bsb')),
	graphql(QuerySetting, PaymentQueryOptions('QueryAcc', 'payment_acc'))
)
class Pay extends React.Component {
	
	render() {
		let payment, price; 

		let _price = this.props.QueryPaymentPrice.loading ? 
			null : 
			this.props.QueryPaymentPrice.getPublicSetting.value;
		
		if (_price <= 0 || isNaN(_price)) {
			price = (
				<p>
					The cost for this event is yet to be determined, but it will cover registration and dinner.
					We will announce it on Facebook when this has been finalised so keep an eye out for it.
				</p>
			);
		}
		else {
			price = (
				<p>
					The cost for this event is&nbsp;
					<span className='highlight'>
						${_price}
					</span>, 
					which pays for registration and dinner.
				</p>
			);
		}


		if (this.props.authenticated) {
			let reference = <Spinner className='pt-small'/>;
			if (!this.props.QueryMe.loading) {
				reference = `AGR-${this.props.QueryMe.getUserByEmail.username}`;
			}

			payment = (
				<div className='payment-details'>
					<p>
						BSB: {this.props.QueryBsb.loading ? 'Loading...' : this.props.QueryBsb.getProtectedSetting.value}
						<br/>
						ACC: {this.props.QueryAcc.loading ? 'Loading...' : this.props.QueryAcc.getProtectedSetting.value}
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
					<ScrollAnimation animateOnce animateIn='fadeInUp' offset={-500} duration={0.5}>
					<div className='infobox'>
						<h2>
							Payment details
						</h2>
						{price}
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
