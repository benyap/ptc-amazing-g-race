import React from 'react';
import PropTypes from 'prop-types';
import autobind from 'core-decorators/es/autobind';
import { Spinner, Button, Intent, Icon, Collapse } from '@blueprintjs/core';
import MarkdownRenderer from '../../../../../../lib/react/components/MarkdownRenderer';
import ChallengeResponse from './ChallengeResponse';


@autobind
class ChallengeItem extends React.Component {
	static propTypes = {
		challengeKey: PropTypes.string.isRequired,
		item: PropTypes.shape({
			key: PropTypes.string.isRequired,
			type: PropTypes.string.isRequired,
			order: PropTypes.number.isRequired,
			title: PropTypes.string.isRequired,
			description: PropTypes.string.isRequired
		}).isRequired
	}

	state = {
		showItem: false
	}

	onClick() {
		this.setState((prevState) => {
			return { showItem: !prevState.showItem };
		});
	}

	render() {
		let { item, challengeKey } = this.props;
		let response = <ChallengeResponse responseType={item.type} challengeKey={challengeKey} itemKey={item.key}/>;

		return (
			<div style={{marginBottom:'0.5rem'}}>
				<Button text={item.title} className='pt-fill' onClick={this.onClick} iconName={this.state.showItem?'chevron-up':'chevron-down'}/>
				<Collapse isOpen={this.state.showItem}>
					<div className='instruction-panel'>
						<MarkdownRenderer className='markdown-content' src={item.description}/>
					</div>
					{response}
				</Collapse>
			</div>
		);
	}
}


export default ChallengeItem;
