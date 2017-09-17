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
						<span className='small'>
							If you're already registered,&nbsp;
							<Link to='/login' style={{color: 'yellow'}}>
								login here
							</Link>.
						</span>
					</div>
				</ScrollAnimation>
				<Description/>
			</main>
		);
	}
}


export default Home;
