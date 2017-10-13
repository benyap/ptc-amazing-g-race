import React from 'react';
import PropTypes from 'prop-types';
import autobind from 'core-decorators/es/autobind';
import ContactFromSetting from './ContactFromSetting';


@autobind
class ContactsEvent extends React.Component {
	render() {
		return (
			<div>
				<h5>Event contacts</h5>
				<table className='pt-table pt-striped' style={{marginBottom:'1rem'}}>
					<tbody>
						<tr>
							<td>Event Co&#8209;ordinator</td>
							<td>
								<ContactFromSetting settingKey='tel_event_co-ordinator'/>
							</td>
						</tr>
						<tr>
							<td>First Aid Officer</td>
							<td>
								<ContactFromSetting settingKey='tel_first_aid_officer'/>
							</td>
						</tr>
						<tr>
							<td>Website Administrator</td>
							<td>
								<ContactFromSetting settingKey='tel_website_administrator'/>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		);
	}
}


export default ContactsEvent;
