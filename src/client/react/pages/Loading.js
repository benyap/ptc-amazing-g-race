import React from 'react';
import Page from './Page';
import { Spinner } from '@blueprintjs/core';


const loadingStyle = {
	width: '100%',
	height: '100vh',
	background: 'linear-gradient(to top, rgb(247, 255, 206) 30%,rgb(194, 253, 239) 70%)'
}

const titleStyle = {
	lineHeight: '1.8rem',
	fontSize: '1.5rem',
	fontWeight: '200'
}

class Loading extends Page {
	renderPage(route) {
		return (
			<main id='loading' style={loadingStyle}>
				<div className='pt-non-ideal-state'>
					<div className='loading'>
						<Spinner className='pt-large'/>
					</div>
					<h4 className='pt-non-ideal-state-title' style={titleStyle}>
						Welcome to the 
						<br/>
						<em>Amazing (G)<span style={{fontWeight:600}}>Race</span></em>
					</h4>
					<div className='pt-non-ideal-state-description'>
					</div>
				</div>
			</main>
		);
	}
}


export default Loading;
