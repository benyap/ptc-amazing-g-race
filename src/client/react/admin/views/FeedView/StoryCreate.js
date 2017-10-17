import React from 'react';
import PropTypes from 'prop-types';
import autobind from 'core-decorators/es/autobind';
import { graphql } from 'react-apollo';
import { Button, Intent, Dialog, Icon } from '@blueprintjs/core';
import FormInput from '../../../../../../lib/react/components/forms/FormInput';
import MarkdownEditor from '../../../../../../lib/react/components/MarkdownEditor';
import { createStory } from '../../../../graphql/story';
import NotificationToaster from '../../../components/NotificationToaster';


@graphql(createStory('ok'), { name: 'MutationCreateStory' })
@autobind
class StoryCreate extends React.Component {
	static propTypes = {
		refetch: PropTypes.func.isRequired
	}
	
	state = {
		showCreateStory: false,
		createStoryLoading: false,
		createStoryError: null,

		// Fields
		type: 'custom',
		intent: 'none',
		iconName: '',
		content: '',
	}

	toggleCreateStory() {
		this.setState((prevState) => {
			return { 
				showCreateStory: !prevState.showCreateStory,
				type: 'custom',
				intent: 'none',
				iconName: '',
				content: ''
			}
		});
	}

	editValue(valueName) {
		return (e) => {
			this.setState({ [valueName]: e.target.value });
		}
	}

	async submitCreateStory() {
		this.setState({ createStoryLoading: true, createStoryError: null });
		try {
			await this.props.MutationCreateStory({
				variables: {
					type: this.state.type,
					intent: this.state.intent,
					iconName: this.state.iconName,
					content: this.state.content
				}
			});
			await this.props.refetch();
			this.setState({ showCreateStory: false, createStoryLoading: false });
		}
		catch (err) {
			if (this.state.showCreateStory) this.setState({ createStoryLoading: false, createStoryError: err.toString() });
			else {
				this.setState({ createStoryLoading: false });
				NotificationToaster.show({
					intent: Intent.DANGER,
					message: err.toString()
				});
			}
		}
	}

	render() {
		return (
			<div style={{marginBottom:'0.5rem'}}>
				<Button text='Create story' iconName='feed' className='pt-fill pt-minimal' intent={Intent.PRIMARY} onClick={this.toggleCreateStory}/>

				<Dialog isOpen={this.state.showCreateStory} title='Create story' iconName='feed' onClose={this.toggleCreateStory}>
					<div className='pt-dialog-body'>
						{this.state.createStoryError ? 
							<div className='pt-callout pt-intent-danger pt-icon-error' style={{marginBottom:'0.5rem'}}>
								{this.state.createStoryError}
							</div>
							:null}

						<label className='pt-label'>
							Story type: 
							<div className='pt-select'>
								<select onChange={this.editValue('type')}>
									<option value='custom'>Custom</option>
									<option value='useHint'>Use hint</option>
									<option value='challengeUnlock'>Challenge unlock</option>
									<option value='challengeRespond'>Challenge response</option>
									<option value='challengeCheck'>Challenge checked</option>
								</select>
							</div>
						</label>

						<label className='pt-label'>
							Intent: 
							<div className='pt-select'>
								<select onChange={this.editValue('intent')}>
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
								<FormInput id='iconName' value={this.state.iconName} onChange={this.editValue('iconName')} label='Icon name (optional)' helperText='Preview the icon on the left if it is a valid icon name'/>
							</div>
						</div>
						
						<div className='instruction-panel markdown-preview'>
							<MarkdownEditor content={this.state.content} onChange={this.editValue('content')}/>
						</div>
						
					</div>
					<div className='pt-dialog-footer'>
						<div className='pt-dialog-footer-actions'>
							<Button onClick={this.toggleCreateStory} text='Cancel' className='pt-minimal' disabled={this.state.createStoryLoading}/>
							<Button onClick={this.submitCreateStory} text='Create' intent={Intent.PRIMARY} loading={this.state.createStoryLoading}/>
						</div>
					</div>
				</Dialog>
			</div>
		);
	}
}


export default StoryCreate;
