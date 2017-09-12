import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Intent } from '@blueprintjs/core';
import Title from '../Title';


class Home extends React.Component {
	render() {
		return (
			<main>
				<Title/>
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
			</main>
		);
	}
}


export default Home;
