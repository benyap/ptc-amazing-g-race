import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Intent } from '@blueprintjs/core';
import { connect } from 'react-redux';
import ScrollAnimation from 'react-animate-on-scroll';
import Title from '../../components/Title';
import Description2 from '../../components/Description2';


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
					<Link to='/info' style={{color: 'yellow'}}>
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
							<span className='em'>Tuesday 5th December</span>
							<br/>
							<span style={{fontSize:'smaller',color:'#ff6666'}}>
								Limited spots available!
							</span>
						</p>
						<Link to='/register'>
							<Button className='pt-large pt-fill' intent={Intent.PRIMARY}>
								Register now
							</Button>
						</Link>
						<Link to='/pay'>
							<Button className='pt-large pt-fill pt-minimal' intent={Intent.PRIMARY}>
								How do I pay?
							</Button>
						</Link>
						{link}
					</div>
				</ScrollAnimation>
				<Description2/>
			</main>
		);
	}
}


export default Home;
