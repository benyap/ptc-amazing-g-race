import React from 'react';
import PropTypes from 'prop-types';
import autobind from 'core-decorators/es/autobind';
import { Intent } from '@blueprintjs/core';


@autobind
class Validator extends React.Component {
	static propTypes = {
		children: PropTypes.element.isRequired,
		validationFunction: PropTypes.func.isRequired,
		delay: PropTypes.number,
		showPending: PropTypes.bool,
		showSuccess: PropTypes.bool,
		showError: PropTypes.bool
	}

	static defaultProps = {
		delay: 1000,
		showError: true,
		showPending: false,
		showSuccess: false
	}

	componentDidMount() {
		this.mounted = true;
	}

	componentWillUnmount() {
		this.mounted = false;
	}

	componentWillMount() {
		this.value = null;
		this.validateTimeout = null;
		this.renderProps = null;
	}

	updateValidation(value) {
		this.value = value;
		if (this.validateTimeout) clearTimeout(this.validateTimeout);
		this.validateTimeout = setTimeout(this.handleValidation, this.props.delay);
	}

	handleValidation() {
		const result = this.props.validationFunction(this.value);
		
		if (result instanceof Promise) {
			if (this.props.showPending) this.renderProps = this.props.pendingProps;
			else this.renderProps = {};

			result.then((newResult) => {
				this.renderProps = newResult.ok ? 
					(this.props.showSuccess ? this.props.successProps : null) : 
					(this.props.showError ? this.props.errorProps : null);

				if (this.renderProps && newResult.helperText) this.renderProps.helperText = newResult.helperText;
				if (this.mounted) this.forceUpdate();
			});
		}
		else {
			this.renderProps = result.ok ? 
				(this.props.showSuccess ? this.props.successProps : null) : 
				(this.props.showError ? this.props.errorProps : null);
			if (this.renderProps && result.helperText) this.renderProps.helperText = result.helperText;
		}
		
		if (this.mounted) this.forceUpdate();
	}

	render() {
		return (
			<div>
				{React.Children.map(this.props.children, (child) => {
					return React.cloneElement(child, { 
						...this.renderProps,
						updateValidation: this.updateValidation
					});
				})}
			</div>
		);
	}
}


export default Validator;
