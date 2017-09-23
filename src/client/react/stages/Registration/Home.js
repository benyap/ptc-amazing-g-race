import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Intent } from '@blueprintjs/core';
import { connect } from 'react-redux';
import ScrollAnimation from 'react-animate-on-scroll';
import Title from '../components/Title';
import Description from '../components/Description';


const mapStateToProps = (state, ownProps) => {
	return { 
		authenticated: state.auth.login.authenticated
	}
}

@connect(mapStateToProps)
class Home extends React.Component {
	render() {
		let link;
		
		if (this.props.authenticated) {
			link = (
				<span className='small'>
					You're already registered. &nbsp;
					<Link to='/dashboard' style={{color: 'yellow'}}>
						Go to your dashboard
					</Link>.
				</span>
			);
		}
		else {
			link = (
				<span className='small'>
					If you're already registered,&nbsp;
					<Link to='/login' style={{color: 'yellow'}}>
						login here
					</Link>.
				</span>
			);
		}

		return (
			<main>
				<Title/>
				<ScrollAnimation animateOnce animateIn='fadeInDown' offset={0} duration={0.5}>
					<div className='infobox text padding'>
						<p>
							Registration closes
							<br/>
							<span className='em'>Sunday 12th November</span>
						</p>
						<Link to='/register'>
							<Button className='pt-large pt-fill' intent={Intent.PRIMARY}>
								Register now
							</Button>
						</Link>
						{link}
					</div>
				</ScrollAnimation>
				<Description/>
			</main>
		);
	}
}


export default Home;
