import React from 'react';
import { Spinner, NonIdealState } from '@blueprintjs/core';

import '../../assets/images/logo/logo_gray.png';
import '../scss/components/_loading-spinner.scss';


class LoadingSpinner extends React.Component {
	render() {
		return (
			<div className='loading-spinner' style={{margin:'3rem 0'}}>
				<NonIdealState title='Loading...' visual={<Spinner className='pt-large'/>}/>
			</div>
		);
	}
}


export default LoadingSpinner;
