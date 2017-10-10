import React from 'react';
import PropTypes from 'prop-types';
import autobind from 'core-decorators/es/autobind';
import { Spinner, Button, Intent, Icon, Collapse } from '@blueprintjs/core';
import MarkdownRenderer from '../../../../../../lib/react/components/MarkdownRenderer';
import ChallengeItem from './ChallengeItem';


@autobind
class ChallengeProfile extends React.Component {
	static propTypes = {
		challenge: PropTypes.shape({
			key: PropTypes.string.isRequired,
			order: PropTypes.number.isRequired,
			title: PropTypes.string.isRequired,
			description: PropTypes.string.isRequired,
			locked: PropTypes.bool.isRequired,
			teams: PropTypes.array.isRequired,
			items: PropTypes.array.isRequired
		}).isRequired
	}

	state = {
		showDescription: true,
		showItems: false
	}

	toggleCollapse(name) {
		return () => {
			this.setState((prevState) => {
				return { [`show${name}`]: !prevState[`show${name}`] };
			});
		}
	}

	render() {
		let { challenge } = this.props;
		
		let items;
		let description = (
			<div className='instruction-panel'>
				<MarkdownRenderer className='markdown-content' src={challenge.description}/>
			</div>
		);
		
		if (challenge.items.length > 0) {
			description = (
				<div>
					<Button text={`${this.state.showDescription?'Hide':'Show'} description`} className='pt-fill pt-minimal' style={{marginTop: '0.5rem'}}
						iconName={this.state.showDescription?'chevron-up':'chevron-down'} onClick={this.toggleCollapse('Description')}/>
					<Collapse isOpen={this.state.showDescription}>
						<div className='instruction-panel'>
							<MarkdownRenderer className='markdown-content' src={challenge.description}/>
						</div>
					</Collapse>
				</div>
			);

			items = (
				challenge.items.map((item) => {
					return <ChallengeItem key={item.key} order={item.order} item={item}/>
				}).sort((a, b) => {
					if (a.props.order > b.props.order) return 1;
					else if (a.props.order < b.props.order) return -1;
					else return 0;
				})
			);
		}

		return (
			<div>
				<h2>{challenge.title}</h2>
				{description}
				{items}
			</div>
		);
	}
}


export default ChallengeProfile;
