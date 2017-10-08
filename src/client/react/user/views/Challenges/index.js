import React from 'react';
import PropTypes from 'prop-types';
import autobind from 'core-decorators/es/autobind';
import { Spinner, Button } from '@blueprintjs/core';


@autobind
class Challenges extends React.Component {
	state = {
		loading: false,
		showHelp: false,
	}

	toggleShowHelp() {
		this.setState((prevState) => {
			return { showHelp: !prevState.showHelp };
		});
	}

	render() {
		return (
			<main id='challenges' className='dashboard'>
				<div className='content'>
					<h2>
						Challenges
						<Button className='helper-button pt-small pt-minimal pt-intent-warning' iconName='refresh' onClick={this.refresh} disabled={this.state.loading}/>
						<Button className='helper-button pt-small pt-minimal pt-intent-primary' iconName='help' onClick={this.toggleShowHelp}/>
					</h2>
					{ this.state.showHelp ? 
						<div className='pt-callout pt-icon-help pt-intent-primary'>
							Keep track of the challenges you have access to and which ones you've complete. 
							As you progress through the race, you'll see new challenges you unlock show up here. 
						</div>
						: null
					}
				</div>
			</main>
		);
	}
}


export default Challenges;
