import React from 'react';
import PropTypes from 'prop-types';
import { Spinner, NonIdealState } from '@blueprintjs/core';

import '../../assets/images/logo/logo_gray.png';
import '../scss/components/_loading-spinner.scss';


class LoadingSpinner extends React.Component {
	static propTypes = {
		hideText: PropTypes.bool
	}

	render() {
		return (
			<div className='loading-spinner' style={{margin:'3rem 0'}}>
				{ this.props.hideText ?
					<NonIdealState visual={<Spinner className='pt-large'/>}/>
					:
					<NonIdealState title='Loading...' visual={<Spinner className='pt-large'/>}/>
				}
			</div>
		);
	}
}


export default LoadingSpinner;
