const HasLength = (value, min, max) => {
	if (min && value.length < min) {
		return false;
	}
	else if (max && value.length > max) {
		return false;
	}
	else return true;
};

export default HasLength;
