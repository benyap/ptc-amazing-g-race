import React from 'react';
import Page from './Page';
import { Spinner } from '@blueprintjs/core';

import '../scss/pages/_loading.scss';


class Loading extends Page {
	renderPage(route) {
		return (
			<main>
				<div class='pt-non-ideal-state'>
					<div class='loading'>
						<Spinner className='pt-large'/>
					</div>
					<h4 class='pt-non-ideal-state-title title'>
						Welcome to the 
						<br/>
						<em>Amazing GRace</em>
					</h4>
					<div class='pt-non-ideal-state-description'>
					</div>
				</div>
			</main>
		);
	}
}


export default Loading;
