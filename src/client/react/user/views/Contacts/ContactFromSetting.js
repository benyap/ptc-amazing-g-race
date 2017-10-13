import React from 'react';
import PropTypes from 'prop-types';
import { graphql, compose } from 'react-apollo';
import { Spinner } from '@blueprintjs/core';
import { getProtectedSetting } from '../../../../graphql/setting';


const QueryGetContact = {
	name: 'QueryGetContact',
	options: (props) => {
		return {
			fetchPolicy: 'cache-and-network',
			variables: { key: props.settingKey }
		}
	}
}

@graphql(getProtectedSetting('value'), QueryGetContact)
class ContactFromSetting extends React.Component {
	static propTypes = {
		settingKey: PropTypes.string.isRequired
	}

	render() {
		const { loading, error, getProtectedSetting: contact } = this.props.QueryGetContact;

		let loader;
		if (loading) {
			loader = (
				<span style={{position:'absolute',marginTop:'-0.2rem'}}>
					<Spinner className='pt-small'/>
				</span>
			);
		}
		
		if (error) {
			return (
				<span className='pt-text-muted'>
					{error.toString()}
				</span>
			);
		}
		else if (contact) {
			if (contact.value === '-') {
				return (
					<span className='pt-text-muted'>
						Not available.&nbsp;{loader}
					</span>
				);
			}
			else {
				return (
					<span>
						<a href={`tel:${contact.value}`}>
							{contact.value}
						</a>
						&nbsp;{loader}
					</span>
				);
			}
		}
		else if (loading) {
			return (
				<span className='pt-text-muted'>
					Loading...
				</span>
			);
		}
		else {
			return (
				<span className='pt-text-muted'>
					Unable to load.
				</span>
			);
		}
	}
}


export default ContactFromSetting;
