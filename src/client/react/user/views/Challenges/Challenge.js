import React from 'react';
import PropTypes from 'prop-types';
import autobind from 'core-decorators/es/autobind';
import { Spinner, Button, Intent, Icon, Collapse } from '@blueprintjs/core';
import MarkdownRenderer from '../../../../../../lib/react/components/MarkdownRenderer';
import ChallengeItem from './ChallengeItem';


@autobind
class Challenge extends React.Component {
	static propTypes = {
		challenge: PropTypes.shape({
			key: PropTypes.string.isRequired,
			title: PropTypes.string.isRequired,
			description: PropTypes.string.isRequired,
			locked: PropTypes.bool.isRequired,
			public: PropTypes.bool.isRequired,
			teams: PropTypes.array.isRequired,
			items: PropTypes.array.isRequired
		}).isRequired
	}

	state = {
		expandChallenge: null
	}

	onClick() {
		this.setState((prevState) => {
			return { expandChallenge: !prevState.expandChallenge }
		});
	}

	render() {
		let { challenge } = this.props;
		return (
			<div>
				<div className='pt-card pt-elevation-0 pt-interactive' style={{marginBottom:'1rem'}} onClick={this.onClick}>
					<h5 style={{color:'white',marginBottom:this.state.expandChallenge?'0':'0.5rem'}}>
						<Icon iconName={this.state.expandChallenge ? 'chevron-up':'chevron-down'}/>&nbsp;
						{challenge.title}
					</h5>
					{ this.state.expandChallenge ? 
						null : 
						<div className='pt-text-muted'>
							{ !challenge.public ? 
								(challenge.items.length === 1 ? 
									`Only you have unlocked this challenge!` :
									`${challenge.items.length} teams have unlocked this challenge!`)
								: `All teams have access to this challenge!`
							}
						</div>
					}
				</div>
				<Collapse isOpen={this.state.expandChallenge}>
					<div className='instruction-panel'>
						<MarkdownRenderer className='markdown-content' src={challenge.description}/>
					</div>
					{ challenge.items.map((item) => {
							return <ChallengeItem key={item.key} item={item}/>;
						})
					}
				</Collapse>
			</div>
			
		);
	}
}


export default Challenge;
