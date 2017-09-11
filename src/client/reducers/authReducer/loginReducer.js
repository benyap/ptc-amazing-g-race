const initialState = {
	email: null,
	authenticated: false,
	remember: false,
	lastLogin: null,
	lastLogout: null
};

export default function reducer(state = initialState, { type, payload }) {
	switch(type) {

		case 'AUTH_LOGIN': {
			return { ...state,
				email: payload.email,
				authenticated: true,
				remember: payload.remember,
				lastLogin: payload.time
			}
		}

		case 'AUTH_LOGOUT': {
			if (!state.authenticated) {
				// Not authenticated,
				// do not allow logout
				return state;
			}
			else return { ...state,
				email: state.remember ? state.email : null,
				authenticated: false,
				lastLogout: payload.time
			}
		}

		default: {
			return state;
		}
	}
};
