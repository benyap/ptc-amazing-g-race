import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@blueprintjs/core';
import { autobind } from 'core-decorators';
import InstructionCollapse from './InstructionCollapse';

import '../../../../scss/dashboard/_main.scss'
import '../../../../scss/components/_instructions.scss';


@autobind
class Instructions extends React.Component {
	state = {
		showHelp: false
	}

	toggleShowHelp() {
		this.setState((prevState) => {
			return { showHelp: !prevState.showHelp };
		});
	}

	render() {
		return (
			<main id='instructions' className='dashboard'>
				<div className='content'>
					<h2>
						Instructions
						<Button className='helper-button pt-small pt-minimal pt-intent-primary' iconName='help' onClick={this.toggleShowHelp}/>
					</h2>
					{ this.state.showHelp ? 
						<div className='pt-callout pt-icon-help pt-intent-primary'>
							This page contains general information and instructions for the events on the day. 
							For challenge specific instructions, please go to the <Link to='/dashboard/challenges'>challenges</Link> page. 
						</div>
						: null
					}

					<InstructionCollapse article={{
						title: 'Test article',
						text: `
# This is my title\n
Here is some text\n
## Title number two\n
Here is some more text\n
### Title number three\n
Here is even more text, just for testing\n
#### Title number four\n
**Here is even more text, just for testing**\n
##### Title number five\n
*Here is even more text, just for testing*\n
###### Title number six\n
Here is even more text, [and a link.](#)\n`
					}}/>
				</div>
			</main>
		);
	}
}


export default Instructions;
