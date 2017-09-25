import React from 'react';
import { autobind } from 'core-decorators';
import { Button, Intent, Collapse } from '@blueprintjs/core';
import MarkdownRenderer from '../../../../../../../lib/react/components/MarkdownRenderer';

import '../../../../scss/components/_instruction-collapse.scss'


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
		let { title, text } = this.props.article;

		return (
			<div className='instruction-collapse'>
				<Button className='pt-fill ' text={title} 
					iconName={this.state.isOpen?'remove':'add'} onClick={this.toggleOpen}/>
				<Collapse isOpen={this.state.isOpen}>
					<div>
						<MarkdownRenderer src={text}/>
					</div>
				</Collapse>
			</div>
		);
	}
}


export default InstructionCollapse;
