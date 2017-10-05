import React from 'react';
import PropTypes from 'prop-types';
import autobind from 'core-decorators/es/autobind';
import { graphql } from 'react-apollo';
import { Dialog, Button, Intent } from '@blueprintjs/core';
import { setSetting } from '../../../../graphql/setting';


@graphql(setSetting('ok'), { name: 'MutationSetSetting' })
@autobind
class State extends React.Component {
	static propTypes = {
		state: PropTypes.shape({
			name: PropTypes.string.isRequired,
			key: PropTypes.string.isRequired,
			settings: PropTypes.shape({
				set: PropTypes.arrayOf(PropTypes.shape({
					key: PropTypes.string.isRequired,
					value: PropTypes.string.isRequired
				}))
			}).isRequired
		}).isRequired,
		currentState: PropTypes.string.isRequired,
		reload: PropTypes.func
	}

	state = {
		dialogOpen: false,
		loading: false,
		error: false,
		errorText: ''
	}

	toggleDialog() {
		this.setState((prevState) => {
			return {
				dialogOpen: !prevState.dialogOpen,
				loading: false,
				error: false,
				errorText: ''
			}
		});
	}

	async submitChange() {
		if (this.state.error) {
			this.toggleDialog();
		}
		else {
			this.setState({loading: true});
			let error = false;
	
			if (this.props.state.settings && this.props.state.settings.set) {
				for (let setting of this.props.state.settings.set) {
					try {
						await this.props.MutationSetSetting({
							variables: {
								key: setting.key,
								value: setting.value
							}
						});
					}
					catch(e) {
						this.setState({loading: false, error: true, errorText: e.toString()});
						error = true;
						break;
					}
				}
			}
	
			if (!error) {
				this.setState({loading: false, error: false});
				this.toggleDialog();
				if (this.props.reload) this.props.reload();
			}
		}
	}

	render() {
		const { name, key } = this.props.state;
		let modifier = '';
		if (this.props.currentState === this.props.state.key) modifier = 'current-state';

		let error = null;
		if (this.state.error) {
			error = (
				<div className='pt-callout pt-intent-danger pt-icon-error'>
					<p>
						{this.state.errorText}
					</p>
				</div>
			);
		}

		return (
			<div onClick={this.toggleDialog} class={'pt-card pt-elevation-1 pt-interactive ' + modifier}>
				<h5>{name}</h5>
				<Dialog isOpen={this.state.dialogOpen} title={'Modify game state'}
					onClose={this.toggleDialog}>
					<div style={{padding: '0.4rem'}}>
						<div className='pt-dialog-body'>
							{error ? 
								error:
								<p>
									Are you sure you want to change the game state to <code>{key}</code>?
								</p>
							}
						</div>
						<div className='pt-dialog-footer'>
							<div className='pt-dialog-footer-actions'>
								<Button onClick={this.toggleDialog} text='Cancel' className='pt-minimal' disabled={this.state.loading}/>
								<Button onClick={this.submitChange} text='OK' intent={Intent.PRIMARY} loading={this.state.loading}/>
							</div>
						</div>
					</div>
				</Dialog>
			</div>
		);
	}
}


export default State;
