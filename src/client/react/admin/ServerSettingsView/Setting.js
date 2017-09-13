import React from 'react';
import PropTypes from 'prop-types';
import DateFormat from 'dateformat';
import { Dialog, Button, Intent } from '@blueprintjs/core';
import { graphql, gql } from 'react-apollo';
import { autobind } from 'core-decorators';
import FormInput from '../../../../../lib/react/components/forms/FormInput';


const MutationSetSetting = gql`
mutation SetSetting($key:String!,$value:String!){
  setSetting(key:$key,value:$value) {
    ok
  }
}`;

const MutationSetSettingOptions = {
	name: 'MutationSetSetting'
}


@graphql(MutationSetSetting, MutationSetSettingOptions)
@autobind
class Setting extends React.Component {
	static propTypes = {
		name: PropTypes.string.isRequired,
		modified: PropTypes.string.isRequired,
		modifiedBy: PropTypes.string.isRequired,
		valueType: PropTypes.oneOf([
			'string', 'integer', 'stringList', 'integerList'
		])
	}

	state = { 
		editDialogOpen: false,
		editError: false,
		editErrorText: null,
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
					editError: true,
					editErrorText: 'Invalid value.'
				});
				return;
			}
		}

		this.setState({editLoading: true});
		try {
			let results = await this.props.MutationSetSetting({
				variables: {
					key: this.state.editKey,
					value: this.state.editValue
				}
			});
		}
		catch(e) {
			this.setState({editLoading: false, editError: true, editErrorText: e.toString()});
			return;
		}
		
		this.setState({editLoading: false, editError: false});
		this.toggleDialog();
	}

	render() {
		let { name, value, valueType, modified, modifiedBy } = this.props;

		return (
			<div id={name} className='pt-card pt-elevation-0 pt-interactive' onClick={this.handleClick(name, value, valueType)}>
				<h5><code>{name}</code></h5>
				{value ? 
					<p><b>Value: </b> {value}</p>:
					<ul>
						Values: 
						{values.map((value) => {
							return <li>{value}</li>
						})}
					</ul>
				}
				<p><b>Modified: </b> {DateFormat(new Date(modified), 'mmm dd yyyy hh:MM:ssTT')}</p>
				<p><b>Modified by: </b> {modifiedBy}</p>

				<Dialog isOpen={this.state.editDialogOpen} title={'Edit ' + this.state.editKey}
					onClose={this.toggleDialog}>
					<div style={{padding: '1rem'}}>
						<div className='pt-dialog-body'>
							<b>Value:</b> <FormInput id={this.state.editKey} value={this.state.editValue} onChange={this.handleChange} 
								intent={this.state.editError ? Intent.DANGER : Intent.NONE} 
								helperText={this.state.editError ? this.state.editErrorText : null }/>
						</div>
						<div className='pt-dialog-footer'>
							<div className='pt-dialog-footer-actions'>
								<Button onClick={this.toggleDialog} text='Cancel' disabled={this.state.editLoading}/>
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
