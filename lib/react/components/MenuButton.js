import React from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { Popover, Position, Button } from "@blueprintjs/core";


@autobind
class MenuButton extends React.Component {
	static propTypes = {
		menu: PropTypes.element,
		iconName: PropTypes.string,
		text: PropTypes.string,
		loading: PropTypes.bool,
		buttonClass: PropTypes.string,
		popoverClass: PropTypes.string,
		position: PropTypes.oneOf(Object.keys(Position).map(
			(value) => {
				let num = parseInt(value);
				if (isNaN(num)) return value;
				else return num;
			}
		))
	}

	static defaultProps = {
		loading: false,
		position: Position.BOTTOM_RIGHT
	}

	render() {
		return (
			<Popover className={this.props.popoverClass} content={this.props.menu} position={this.props.position} isDisabled={this.props.loading}>
				<Button 
					type='button' 
					loading={this.props.loading}
					className={this.props.buttonClass} 
					iconName={this.props.iconName}
				>
					{this.props.text}
				</Button>
			</Popover>
		);
	}
}


export default MenuButton;
