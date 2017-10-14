import React from 'react';
import PropTypes from 'prop-types';
import autobind from 'core-decorators/es/autobind';
import { Button } from '@blueprintjs/core';


@autobind
class Feed extends React.Component {
	state = {
		loading: false,
		showHelp: false
	}

	toggleShowHelp() {
		this.setState((prevState) => {
			return { showHelp: !prevState.showHelp };
		});
	}

	render() {
		return (
			<main id='feed' className='dashboard'>
				<div className='content'>
					<h2>
						Newsfeed
						<Button className='helper-button pt-small pt-minimal pt-intent-warning' iconName='refresh' onClick={this.refresh} disabled={this.state.loading}/>
						<Button className='helper-button pt-small pt-minimal pt-intent-primary' iconName='help' onClick={this.toggleShowHelp}/>
					</h2>
					{ this.state.showHelp ? 
						<div className='pt-callout pt-icon-help pt-intent-primary'>
							See regular updates on what the other teams have been up to... 
							so make sure you keep up or you don't stand a chance!
						</div>
						: null
					}
				</div>
			</main>
		);
	}
}


export default Feed;
