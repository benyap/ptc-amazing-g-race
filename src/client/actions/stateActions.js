export function loadState() {
	return {
		type: 'STATE_LOAD'
	}
}

export function saveState() {
	return {
		type: 'STATE_SAVE'
	}
}

export function challengeLoadWasSuccessful(successful) {
	return {
		type: 'CHALLENGE_LOAD_WAS_SUCCESSFUL',
		payload: {
			successful
		}
	}
}
