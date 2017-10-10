import React from 'react';
import PropTypes from 'prop-types';
import autobind from 'core-decorators/es/autobind';
import { Spinner, Button, Intent, Icon, Collapse } from '@blueprintjs/core';
import MarkdownRenderer from '../../../../../../lib/react/components/MarkdownRenderer';


@autobind
class ChallengeItem extends React.Component {
	static propTypes = {
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
		let { item } = this.props;
		let response;

		switch (item.type) {
			case 'upload': {
				response = <div className='pt-text-muted'>Upload an image.</div>;
				break;
			}
			case 'phrase': {
				response = <div className='pt-text-muted'>Enter a phrase.</div>;
				break;
			}
		}

		return (
			<div style={{marginBottom:'0.5rem'}}>
				<Button text={item.title} intent={Intent.PRIMARY} className='pt-fill' onClick={this.onClick} iconName={this.state.showItem?'chevron-up':'chevron-down'}/>
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
