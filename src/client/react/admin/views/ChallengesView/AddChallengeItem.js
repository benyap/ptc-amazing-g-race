import React from 'react';
import PropTypes from 'prop-types';
import autobind from 'core-decorators/es/autobind';
import { Button, Intent, EditableText, Switch, Dialog } from '@blueprintjs/core';
import { graphql } from 'react-apollo';
import FormInput from '../../../../../../lib/react/components/forms/FormInput';
import { createChallengeItem } from '../../../../graphql/challenge';
import NotificationToaster from '../../../components/NotificationToaster';


@graphql(createChallengeItem('ok'), { name: 'MutationCreateChallengeItem' })
@autobind
class AddChallengeItem extends React.Component {
	static propTypes = {
		challengeKey: PropTypes.string.isRequired,
		refetchChallenges: PropTypes.func.isRequired
	}

	state = {
		showAddItem: false,
		addItemLoading: false,
		addItemError: null,
		addItemKey: '',
		addItemTitle: '',
		addItemOrder: '',
		addItemType: 'phrase',
	}

	toggleShowDialog() {
		this.setState((prevState) => {
			return { 
				showAddItem: !prevState.showAddItem,
				addItemError: null,
				addItemKey: '',
				addItemTitle: '',
				addItemOrder: '',
				addItemType: 'phrase'
			}
		});
	}

	onAddItemValueChange(value) {
		return (e) => {
			this.setState({[value]: e.target.value});
		}
	}

	async submitAddItem() {
		this.setState({addItemLoading: true, addItemError: false});
		try {
			await this.props.MutationCreateChallengeItem({
				variables: { 
					key: this.props.challengeKey,
					itemKey: this.state.addItemKey,
					title: this.state.addItemTitle,
					order: this.state.addItemOrder,
					type: this.state.addItemType
				}
			});
			await this.props.refetchChallenges();
			this.setState({addItemLoading: false, showAddItem: false});
		}
		catch (err) {
			if (this.state.showAddItem) this.setState({ addItemLoading: false, addItemError: err.toString() });
			else {
				this.setState({ addItemLoading: false });
				NotificationToaster.show({
					intent: Intent.DANGER,
					message: err.toString()
				});
			}
		}
	}

	render() {
		return (
			<div style={{marginTop: '0.5rem'}}>
				<Button text='Add item' className='pt-small' onClick={this.toggleShowDialog}/>
				<Dialog isOpen={this.state.showAddItem} onClose={this.toggleShowDialog} title='Add challenge item'>
					<div className='pt-dialog-body'>
						{ this.state.addItemError ? 
							<div className='pt-callout pt-intent-danger pt-icon-error' style={{marginBottom:'1rem'}}>
								{ this.state.addItemError }
							</div> 
							: null
						}

						<div className='pt-callout pt-icon-info-sign' style={{marginBottom:'0.5rem'}}>
							<ul style={{margin: '0', padding: '0 0 0 1rem'}}>
								<li>
									The <b>item key</b> is used to uniquely identify the item. Users do not see the item key.
								</li>
								<li>
									The <b>title</b> is what the users will see when they look at this item.
								</li>
								<li>
									The <b>order</b> determines the order in which the item will be displayed to the user.
								</li>
								<li>
									The <b>type</b> determines the required response from the user for this item.
								</li>
							</ul>
						</div>

						<FormInput id='key' value={this.state.addItemKey} label='Challenge item key' onChange={this.onAddItemValueChange('addItemKey')} disabled={this.state.addItemLoading}
							helperText='Use the format <challenge name>_<item name>'/>

						<FormInput id='title' value={this.state.addItemTitle} label='Challenge item title' onChange={this.onAddItemValueChange('addItemTitle')} disabled={this.state.addItemLoading}/>

						<FormInput id='order' value={this.state.addItemOrder} label='Challenge item order' onChange={this.onAddItemValueChange('addItemOrder')} disabled={this.state.addItemLoading}
							helperText='Must be an integer.'/>

						<label className='pt-label'>
							Challenge item type
							<div className='pt-select pt-fill'>
								<select onChange={this.onAddItemValueChange('addItemType')} disabled={this.state.addItemLoading}>
									<option value='phrase'>Phrase</option>
									<option value='upload'>Upload</option>
								</select>
							</div>
						</label>
					</div>
					<div className='pt-dialog-footer'>
						<div className='pt-dialog-footer-actions'>
							<Button text='Close' onClick={this.toggleShowDialog} className='pt-minimal' disabled={this.state.addItemLoading}/>
							<Button text='Add item' onClick={this.submitAddItem} intent={Intent.PRIMARY} loading={this.state.addItemLoading}/>
						</div>
					</div>
				</Dialog>
			</div>
		);
	}
}


export default AddChallengeItem;
