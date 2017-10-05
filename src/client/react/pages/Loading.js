import React from 'react';
import Page from './Page';
import { Spinner } from '@blueprintjs/core';

import '../../assets/images/logo/brand_white.png';


const loadingStyle = {
	width: '100%',
	height: '100vh',
	background: 'linear-gradient(to bottom, #148ff9 40%, #bedeff 100%)'
}

class Loading extends Page {
	renderPage(route) {
		return (
			<main id='loading' style={loadingStyle}>
				<div className='pt-non-ideal-state'>
					<img width='160px' height='160px' style={{marginTop:'-3rem'}} src='/images/brand_white.png'/>
					<Spinner className='pt-large'/>
				</div>
			</main>
		);
	}
}


export default Loading;
