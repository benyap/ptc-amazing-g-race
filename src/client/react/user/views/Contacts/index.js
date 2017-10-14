import React from 'react';
import PropTypes from 'prop-types';
import autobind from 'core-decorators/es/autobind';
import { connect } from 'react-redux';
import { graphql } from 'react-apollo';
import { getUserByEmail } from '../../../../graphql/user';
import ContactsEvent from './ContactsEvent';
import ContactsTeam from './ContactsTeam';


const mapStateToProps = (state, ownProps) => {
	return { email: state.auth.login.email }
}

const QueryGetUserOptions = {
	name: 'QueryGetUser',
	options: (props) => {
		return {
			fetchPolicy: 'cache-and-network',
			variables: { email: props.email }
		}
	}
}

@connect(mapStateToProps)
@graphql(getUserByEmail('_id teamId'), QueryGetUserOptions)
@autobind
class Contacts extends React.Component {
	render() {
		const { QueryTelEventCoordinator, QueryTelFirstAidOfficer, QueryTelWebsiteAdmin } = this.props;
		return (
			<main id='help' className='dashboard'>
				<div className='content'>
					<h2>Important contacts</h2>

					<div className='pt-callout pt-intent-warning pt-icon-warning-sign'>
						<h5>In case of emergency</h5>
						<div>
							Please <a href='tel:000'>call 000</a>, then notify the event co&#8209;ordinator&nbsp;
							<span className='pt-text-muted'>
								(pressing on links in blue on this page will CALL the number).
							</span>
						</div>
					</div>

					<ContactsEvent/>
					
					{
						this.props.QueryGetUser.getUserByEmail ? 
						<ContactsTeam teamId={this.props.QueryGetUser.getUserByEmail.teamId}/> : null
					}
				</div>
			</main>
		);
	}
}


export default Contacts;
