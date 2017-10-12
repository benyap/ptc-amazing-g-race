import React from 'react';
import PropTypes from 'prop-types';
import { Menu, MenuItem, MenuDivider } from "@blueprintjs/core";
import { connect } from 'react-redux';
import { toggleShowNotifications } from '../../../../actions/settingsActions';
import autobind from 'core-decorators/es/autobind';


const mapStateToProps = (state, ownProps) => {
	return { 
		showResponses: state.settings.showNotifications
	}
}

@connect(mapStateToProps)
@autobind
class SettingsMenu extends React.Component {
	static propTypes = {
		handleLogout: PropTypes.func.isRequired
	}

	handleToggleShowResponses() {
		this.props.dispatch(toggleShowNotifications());
	}

	render() {
		const { handleLogout, showResponses } = this.props;

		return (
			<Menu>
				<MenuItem iconName='upload' text={`${showResponses?'Turn notifications off':'Turn notifications on'}`} 
					onClick={this.handleToggleShowResponses} shouldDismissPopover={false}/>
				<MenuDivider/>
				<MenuItem iconName='log-out' text='Logout' onClick={handleLogout}/>
			</Menu>
		);
	}
}


export default SettingsMenu;
