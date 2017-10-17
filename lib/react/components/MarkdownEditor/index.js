import React from 'react';
import PropTypes from 'prop-types';
import autobind from 'core-decorators/es/autobind';
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
		defaultContent: PropTypes.string,
		content: PropTypes.string,
		onChange: PropTypes.func,
		hidePreview: PropTypes.bool,
		hideHelp: PropTypes.bool,
		disabled: PropTypes.bool,
	}

	static defaultProps = {
		showPreview: true,
		showHelp: true,
		disabled: false
	}

	state = { 
		content: this.props.content ? this.props.content : (this.props.defaultContent ? this.props.defaultContent : null),
		selectedTabId: 'editor'
	}

	handleEditorChange(event) {
		this.setState({ content: event.target.value });
	}

	handleTabChange(selectedTabId) {
		this.setState({
			selectedTabId
		});
	}

	render() {
		const onChange = this.props.onChange ? this.props.onChange : this.handleEditorChange;
		const readOnly = onChange ? false : true;

		return (
			<div className='markdown editor'>
				<Tabs2 
					onChange={this.handleTabChange} 
					selectedTabId={this.state.selectedTabId}
					renderActiveTabPanelOnly={true}
					key='horizontal'
					animate={true}>
					
					<MediaQuery maxWidth={bp.xs}>
						<div className='heading'>Editor</div>
					</MediaQuery>
					<MediaQuery minWidth={bp.xs + 1}>
						<div className='heading'>Markdown Editor</div>
					</MediaQuery>

					<Tab2 id='editor' title='Editor' panel={
						<MarkdownInput src={this.props.content || this.state.content} onChange={onChange} readOnly={readOnly} disabled={this.props.disabled}/>
					}/>

					{this.props.hidePreview ? null :
						<Tab2 id='renderer' title='Preview' panel={
							<MarkdownRenderer className='markdown-content' src={this.props.content || this.state.content}/>
						}/> }

					{this.props.hideHelp ? null :
						<Tab2 id='help' title='Help' panel={
							<MarkdownRenderer className='help' src={MarkdownReference}/>
						}/> }

					<Tabs2.Expander/>
				</Tabs2>
			</div>
		);
	}
}


export default MarkdownEditor;
