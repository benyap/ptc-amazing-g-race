import React from 'react';
import { Link } from 'react-router-dom';
import { AnchorButton, Intent } from '@blueprintjs/core';

import '../../scss/_hero.scss';


class Home extends React.Component {
	render() {
		return (
			<main className='hero' style={{height: '200%', width: '100%'}}>
				<div className='hero image' style={{height: '200%', width: '100%'}}></div>

				<div className='title text padding'>
					The Amazing G<span className='em'>Race</span>
				</div>
				<div className='date text padding'>
					7th December, 2017
				</div>
				<div className='registration text padding'>
					Registration closes
					<br/>
					<span className='em'>Sunday 12th November, 2017</span>
					<Link className='register' to='/register'>
						<AnchorButton className='pt-large pt-fill' intent={Intent.PRIMARY}>
							REGISTER
						</AnchorButton>
					</Link>
				</div>
			</main>
		);
	}
}


export default Home;
