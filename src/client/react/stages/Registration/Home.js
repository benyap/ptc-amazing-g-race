import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Intent } from '@blueprintjs/core';
import ScrollAnimation from 'react-animate-on-scroll';
import Title from '../Title';
import Description from '../Promotion/Description';


class Home extends React.Component {
	render() {
		return (
			<main>
				<Title/>
				<ScrollAnimation animateOnce animateIn='fadeInDown' offset={0}>
					<div className='registration text padding'>
						Registration closes
						<br/>
						<span className='em'>Sunday 12th November</span>
						<Link className='register' to='/register'>
							<Button className='pt-large pt-fill' intent={Intent.PRIMARY}>
								Register now
							</Button>
						</Link>
					</div>
				</ScrollAnimation>
				<Description/>
			</main>
		);
	}
}


export default Home;
