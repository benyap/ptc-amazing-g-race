import React from 'react';
import PropTypes from 'prop-types';
import DateFormat from 'dateformat';
import autobind from 'core-decorators/es/autobind';
import { Dialog } from '@blueprintjs/core/dist/components/dialog/dialog';
import { Button } from '@blueprintjs/core/dist/components/button/buttons';
import { Intent } from '@blueprintjs/core/dist/common/intent';
import { graphql } from 'react-apollo';
import { setSetting } from '../../../graphql/setting';
import FormInput from '../../../../../lib/react/components/forms/FormInput';


@graphql(setSetting('ok'), { name: 'MutationSetSetting' })
@autobind
class Setting extends React.Component {
	static propTypes = {
		name: PropTypes.string.isRequired,
		modified: PropTypes.string.isRequired,
		modifiedBy: PropTypes.string.isRequired,
		valueType: PropTypes.oneOf([
			'string', 'integer', 'float', 'stringList', 'integerList', 'floatList'
		]),
		reload: PropTypes.func
	}

	state = { 
		editDialogOpen: false,
		editError: null,
		editKey: 'null',
		editValue: 'null',
		editValueType: 'null',
		editLoading: false,
		errorDialogOpen: false
	}

	handleClick(name, value, valueType) {
		if (valueType === 'stringList' || valueType === 'integerList') {
			return (e) => {
				this.setState((prevState) => {
					return {
						errorDialogOpen: !prevState.errorDialogOpen,
					}
				});
			}
		}
		return (e) => {
			this.toggleDialog(name, value, valueType);
		};
	}

	toggleDialog(name, value, valueType) {
		this.setState((prevState) => {
			return {
				editDialogOpen: !prevState.editDialogOpen,
				editKey: prevState.editDialogOpen ? 'null' : name,
				editValue: prevState.editDialogOpen ? 'null' : value,
				editValueType: prevState.editDialogOpen ? 'null' : valueType,
				editError: false
			}
		});
	}

	handleChange(e) {
		this.setState({
			editValue: e.target.value
		});
	}

	async submitChange(e) {
		if (this.state.editValueType === 'integer') {
			if (isNaN(parseInt(this.state.editValue))) {
				this.setState({
					editError: 'Invalid value.'
				});
				return;
			}
		}
		if (this.state.editValueType === 'float') {
			if (isNaN(parseFloat(this.state.editValue))) {
				this.setState({
					editError: 'Invalid value.'
				});
				return;
			}
		}

		this.setState({editLoading: true});
		try {
			await this.props.MutationSetSetting({
				variables: {
					key: this.state.editKey,
					value: this.state.editValue
				}
			});

			this.setState({editLoading: false, editError: null});
			this.toggleDialog();
			if (this.props.reload) this.props.reload();
		}
		catch(e) {
			this.setState({editLoading: false, editError: e.toString()});
		}
	}

	render() {
		const { name, value, values, valueType, modified, modifiedBy } = this.props;

		return (
			<div id={name} className='pt-card pt-elevation-0 pt-interactive' onClick={this.handleClick(name, value, valueType)}>
				<h5><code>{name}</code></h5>
				{value ? 
					<p><b>Value: </b> {value}</p>:
					<div>
						<b>Values: </b>
						<ul>
							{values.map((value) => {
								return <li key={value}>{value}</li>
							})}
						</ul>
					</div>
				}
				<p><b>Modified: </b> {DateFormat(new Date(modified), 'mmm dd yyyy hh:MM:ssTT')}</p>
				<p><b>Modified by: </b> {modifiedBy}</p>

				<Dialog isOpen={this.state.editDialogOpen} title={'Edit ' + this.state.editKey}
					onClose={this.toggleDialog}>
					<div style={{padding: '1rem'}}>
						<div className='pt-dialog-body'>
							{this.state.editError ? 
								<div className='pt-callout pt-intent-danger pt-icon-error'>
									{this.state.editError}
								</div>
								:null}
							<b>Value:</b> <FormInput id={this.state.editKey} value={this.state.editValue} onChange={this.handleChange} 
								intent={this.state.editError ? Intent.DANGER : Intent.NONE}/>
						</div>
						<div className='pt-dialog-footer'>
							<div className='pt-dialog-footer-actions'>
								<Button onClick={this.toggleDialog} text='Cancel' className='pt-minimal' disabled={this.state.editLoading}/>
								<Button onClick={this.submitChange} text='Save' intent={Intent.PRIMARY} loading={this.state.editLoading}/>
							</div>
						</div>
					</div>
				</Dialog>
			</div>
		);
	}
}


export default Setting;
