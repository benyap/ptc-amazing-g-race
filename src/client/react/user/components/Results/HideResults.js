import React from 'react';
import autobind from 'core-decorators/es/autobind';
import { NonIdealState, Button, Intent } from '@blueprintjs/core';
import LoadingSpinner from '../../../components/LoadingSpinner';


@autobind
class HideResults extends React.Component {
	refreshPage() {
		location.reload();
	}

	render() {
		return (
			<div>
				<NonIdealState 
					title='Hold your horses...' 
					description='Results will be out soon. Check this page again in a few minutes!' 
					visual={<LoadingSpinner hideText/>}
					action={<Button intent={Intent.PRIMARY} text='Refresh page' onClick={this.refreshPage}/>}/>
			</div>
		);
	}
}


export default HideResults;
