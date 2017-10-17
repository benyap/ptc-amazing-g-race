import React from 'react';
import autobind from 'core-decorators/es/autobind';
import { Button, Intent, Collapse } from '@blueprintjs/core';
import MarkdownRenderer from '../../../../../../lib/react/components/MarkdownRenderer';

import '../../scss/components/_instruction-panel.scss';


@autobind
class InstructionCollapse extends React.Component {
	state = {
		isOpen: false,
	}

	toggleOpen() {
		this.setState((prevState) => {
			return { isOpen: !prevState.isOpen }
		});
	}

	render() {
		const { title, content } = this.props.article;

		return (
			<div className='instruction-collapse'>
				<Button className='pt-fill' text={title} intent={Intent.PRIMARY}
					iconName={this.state.isOpen?'chevron-down':'chevron-right'} onClick={this.toggleOpen}/>
				<Collapse isOpen={this.state.isOpen}>
					<div className='instruction-panel'>
						<MarkdownRenderer className='markdown-content' src={content}/>
					</div>
				</Collapse>
			</div>
		);
	}
}


export default InstructionCollapse;
