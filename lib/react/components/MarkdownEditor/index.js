import React from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { Tab2, Tabs2 } from "@blueprintjs/core";
import MediaQuery from 'react-responsive';
import bp from '../utility/bp';
import MarkdownRenderer from '../MarkdownRenderer';
import MarkdownInput from './MarkdownInput';
import MarkdownReference from './MarkdownReference';

import '../../scss/components/_markdownEditor.scss';


@autobind
class MarkdownEditor extends React.Component {
	static propTypes = {
		src: PropTypes.string,
		hidePreview: PropTypes.bool,
		hideHelp: PropTypes.bool
	}

	static defaultProps = {
		showPreview: true,
		showHelp: true
	}

	state = { 
		src: this.props.src ? this.props.src : '',
		selectedTabId: 'editor'
	}

	handleEditorChange(event) {
		this.setState({
			src: event.target.value,
			textarea: event.target
		});
	}

	handleTabChange(selectedTabId) {
		this.setState({
			selectedTabId
		});
	}

	render() {
		return (
			<div className='markdown editor'>
				<Tabs2 
					onChange={this.handleTabChange} 
					selectedTabId={this.state.selectedTabId}
					renderActiveTabPanelOnly={true}
					key='horizontal'
					animate={true} 
				>
					<MediaQuery maxWidth={bp.xs}>
						<div className='heading'>Editor</div>
					</MediaQuery>
					<MediaQuery minWidth={bp.xs + 1}>
						<div className='heading'>Markdown Editor</div>
					</MediaQuery>

					<Tab2 id='editor' title='Editor' panel={<MarkdownInput src={this.state.src} onChange={this.handleEditorChange}/>}/>
					{this.props.hidePreview ? null :
						<Tab2 id='renderer' title='Preview' panel={<MarkdownRenderer src={this.state.src}/>}/> }
					{this.props.hideHelp ? null :
						<Tab2 id='help' title='Help' panel={<MarkdownRenderer src={MarkdownReference}/>}/> }
					<Tabs2.Expander />
				</Tabs2>
			</div>
		);
	}
}


export default MarkdownEditor;
