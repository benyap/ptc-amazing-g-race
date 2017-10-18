import React from 'react';
import PropTypes from 'prop-types';
import autobind from 'core-decorators/es/autobind';
import { graphql } from 'react-apollo';
import { Button, Intent, Dialog, Icon } from '@blueprintjs/core';
import MarkdownEditor from '../../../../../../lib/react/components/MarkdownEditor';
import { editStory } from '../../../../graphql/story';
import NotificationToaster from '../../../components/NotificationToaster';
import IconSelect from './IconSelect';


@graphql(editStory('ok'), { name: 'MutationEditStory' })
@autobind
class StoryEdit extends React.Component {
	static propTypes = {
		storyId: PropTypes.string.isRequired,
		story: PropTypes.shape({
			iconName: PropTypes.string.isRequired,
			intent: PropTypes.string.isRequired,
			content: PropTypes.string.isRequired
		}).isRequired,
		refetch: PropTypes.func.isRequired
	}

	state = {
		showEditStory: false,
		editStoryLoading: false,
		editStoryError: null,
		modified: false,

		// Fields
		intent: this.props.story.intent,
		intentModified: false,

		iconName: this.props.story.iconName,
		iconNameModified: false,
		
		content: this.props.story.content,
		contentModified: false
	}

	toggleEditStory() {
		this.setState((prevState) => {
			return { showEditStory: !prevState.showEditStory }
		});
	}

	editValue(valueName) {
		return (e) => {
			this.setState({ [valueName]: e.target.value, [`${valueName}Modified`]: true, modified: true });
		}
	}

	async submitEditStory() {
		this.setState({ editStoryLoading: true, editStoryError: null });

		// Check which properties need to be updated
		const PROPERTIES = ['intent', 'iconName', 'content'];

		for (let index in PROPERTIES) {
			const property = PROPERTIES[index];

			// Don't edit anymore if there are errors
			if (!this.state.editStoryError && this.state[`${property}Modified`]) {
				try {
					await this.props.MutationEditStory({
						variables: {
							storyId: this.props.storyId,
							property: property,
							value: this.state[property]
						}
					});
					this.setState({ [`${property}Modified`]: false });
				}
				catch (err) {
					if (this.state.showEditStory) this.setState({ editStoryLoading: false, editStoryError: err.toString() });
					else {
						NotificationToaster.show({
							intent: Intent.DANGER,
							message: err.toString()
						});
					}
				}
			}
		}

		await this.props.refetch();
		if (!this.state.editStoryError) {
			this.setState({ editStoryLoading: false, showEditStory: false });
		}
	}

	render() {
		return (
			<span style={{marginBottom:'0.5rem'}}>
				<Button className='pt-minimal pt-small pt-intent-primary' text='Edit' onClick={this.toggleEditStory} loading={this.state.editStoryLoading}/>

				<Dialog isOpen={this.state.showEditStory} title='Edit story' iconName='feed' onClose={this.toggleEditStory}>
					<div className='pt-dialog-body'>
						{this.state.editStoryError ? 
							<div className='pt-callout pt-intent-danger pt-icon-error' style={{marginBottom:'0.5rem'}}>
								{this.state.editStoryError}
							</div>
							:null}

						<label className='pt-label'>
							Intent: 
							<div className='pt-select'>
								<select onChange={this.editValue('intent')} value={this.state.intent} disabled={this.state.editStoryLoading}>
									<option value='none'>None (white)</option>
									<option value='primary'>Primary (blue)</option>
									<option value='success'>Success (green)</option>
									<option value='warning'>Warning (yellow)</option>
									<option value='danger'>Danger (red)</option>
								</select>
							</div>
						</label>

						<div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
							<div style={{width:'40px',height:'40px',padding:'10px',textAlign:'center',border:'solid 1px slategray',borderRadius:'0.3rem'}}>
								<Icon iconName={this.state.iconName} iconSize={20}/>
							</div>
							<div style={{flexGrow:'1',marginLeft:'1rem'}}>
								<IconSelect value={this.state.iconName} onChange={this.editValue('iconName')} disabled={this.state.editStoryLoading}/>
							</div>
						</div>
						
						<div className='instruction-panel markdown-preview'>
							<MarkdownEditor title='Post content' content={this.state.content} onChange={this.editValue('content')} disabled={this.state.editStoryLoading}/>
						</div>
						
					</div>
					<div className='pt-dialog-footer'>
						<div className='pt-dialog-footer-actions'>
							<Button onClick={this.toggleEditStory} text='Cancel' className='pt-minimal' disabled={this.state.editStoryLoading}/>
							<Button onClick={this.submitEditStory} text='Save' intent={Intent.PRIMARY} loading={this.state.editStoryLoading} disabled={!this.state.modified}/>
						</div>
					</div>
				</Dialog>
			</span>
		);
	}
}


export default StoryEdit;
