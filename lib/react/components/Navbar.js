import React from 'react';
import PropTypes from 'prop-types';
import autobind from 'core-decorators/es/autobind';
import { Dialog } from '@blueprintjs/core';
import MediaQuery from 'react-responsive';
import bp from '../components/utility/bp';
import Authenticated from './utility/Authenticated';

import '../scss/components/_navbar.scss';


@autobind
class Navbar extends React.Component {
	static propTypes = {
		light: PropTypes.bool,
		sideNavigationTitle: PropTypes.string,
		smallTitle: PropTypes.string,
		children: PropTypes.arrayOf(PropTypes.element)
	}

	static defaultProps = {
		light: false
	}

	state = {
		showSubNavigation: false
	}

	toggleSubNavigation() {
		this.setState((prevState) => {
			return { showSubNavigation: !prevState.showSubNavigation }
		});
	}

	closeSubNavigation() {
		if (this.state.showSubNavigation) {
			this.setState((prevState) => {
				return { showSubNavigation: false }
			});
		}
	}

	render() {
		return (
			<div className='navigation'>
				<nav className={'pt-navbar' + (this.props.light?' pt-light':' pt-dark')}>
					<MediaQuery maxWidth={bp.s}>
						<div class='pt-navbar-group pt-align-left'>
							<button className='pt-button pt-minimal pt-icon-menu' onClick={this.toggleSubNavigation}></button>
							<span className='pt-navbar-divider'></span>
							<div className='pt-navbar-brand'>{this.props.smallTitle}</div>
						</div>
					</MediaQuery>
					<MediaQuery minWidth={bp.s+1}>
						<div class='pt-navbar-group pt-align-left'>
							<Authenticated>
								{ this.props.children?
									React.cloneElement(this.props.children[0], { onClick: this.closeSubNavigation }) :
									null }
							</Authenticated>
						</div>
					</MediaQuery>
					<div class='pt-navbar-group pt-align-right'>
						<Authenticated>
							{ this.props.children ? this.props.children[1] : null }
						</Authenticated>
					</div>
				</nav>

				{/* Side menu */}
				<Dialog
					title={this.props.sideNavigationTitle}
					className='sidemenu'
					isOpen={this.state.showSubNavigation} 
					onClose={this.toggleSubNavigation}>
					<div className='pt-dialog-body'>
						<div className='pt-button-group pt-vertical pt-large pt-align-left'>
							<Authenticated>
								{ this.props.children?
									React.cloneElement(this.props.children[0], { onClick: this.closeSubNavigation }) :
									null }
							</Authenticated>
						</div>
					</div>
				</Dialog>
			</div>
		);
	}
}


export default Navbar;
