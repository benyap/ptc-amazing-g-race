const sleep = (ms) => {
	return new Promise(resolve => setTimeout(resolve, ms));
}
	
const MockAsync = async (value) => {
	// Mock sending request to server
	await sleep(3000);
	
	if (value.length % 2 === 0) {
		return true;
	}
	else return false;
};

export default MockAsync;
