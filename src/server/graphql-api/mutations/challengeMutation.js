import {
	GraphQLString,
	GraphQLNonNull,
	GraphQLBoolean,
	GraphQLInt,
	GraphQLID
} from 'graphql';

import types from '../types';
import resolvers from '../resolvers';


const createChallenge = {
	type: types.confirmType,
	description: 'Create an challenge',
	args: {
		key: {
			name: 'key',
			description: 'A unique identifier for the challenge',
			type: new GraphQLNonNull(GraphQLString)
		},
		order: {
			name: 'order',
			description: 'A number used to order how the challenges are listed',
			type: new GraphQLNonNull(GraphQLInt)
		},
		passphrase: {
			name: 'passphrase',
			description: 'A passphrase that can be used to unlock the challenge (if one is not provided, the challenge will be publicly available)',
			type: GraphQLString
		},
		title: {
			name: 'title',
			description: 'A title for the challenge',
			type: GraphQLString
		},
		description: {
			name: 'description',
			description: 'A description for the challenge (markdown supported)',
			type: GraphQLString
		},
	},
	resolve(root, params, ctx, options) {
		return resolvers.challengeResolver.createChallenge(root, params, ctx, options);
	}
};


const deleteChallenge = {
	type: types.confirmType,
	description: 'Delete a challenge',
	args: {
		key: {
			name: 'key',
			description: 'The unique identifier of the challenge to delete',
			type: new GraphQLNonNull(GraphQLString)
		}
	},
	resolve(root, params, ctx, options) {
		return resolvers.challengeResolver.deleteChallenge(root, params, ctx, options);
	}
};


const _editChallengeProperty = (description, propertyName, valueType) => {
	return {
		type: types.confirmType,
		description: description,
		args: {
			key: {
				name: 'key',
				description: 'The unique identifier of the challenge to modify',
				type: new GraphQLNonNull(GraphQLString)
			},
			value: {
				name: 'value',
				description: `The value to set ${propertyName} to`,
				type: valueType
			}
		},
		resolve(root, params, ctx, options) {
			params.property = propertyName;	// Set the property name
			return resolvers.challengeResolver._editChallengeProperty(root, params, ctx, options);
		}
	}
}


const setChallengePublic = _editChallengeProperty(
	'Set whether the challenge is publicly available', 'public',
	new GraphQLNonNull(GraphQLBoolean)
);


const setChallengeOrder = _editChallengeProperty(
	'Set the challenge order', 'order',
	new GraphQLNonNull(GraphQLInt)
);


const setChallengePassphrase = _editChallengeProperty(
	'Set the challenge passphrase', 'passphrase',
	new GraphQLNonNull(GraphQLString)
);


const setChallengeTitle = _editChallengeProperty(
	'Set the challenge title', 'title',
	new GraphQLNonNull(GraphQLString)
);


const setChallengeDescription = _editChallengeProperty(
	'Set the challenge description', 'description',
	new GraphQLNonNull(GraphQLString)
);


const setChallengeLocked = _editChallengeProperty(
	'Set to true if the challenge should be locked for everyone', 'locked',
	new GraphQLNonNull(GraphQLBoolean)
);


const addTeamToUnlocked = {
	type: types.confirmType,
	description: 'Add a team to the list of unlocked teams for the specified challenge',
	args: {
		key: {
			name: 'key',
			description: 'The key of the challenge to add the team to',
			type: new GraphQLNonNull(GraphQLString)
		},
		teamId: {
			name: 'teamId',
			description: 'The id of the team to add',
			type: new GraphQLNonNull(GraphQLID)
		}
	},
	resolve(root, params, ctx, options) {
		return resolvers.challengeResolver.addTeamToUnlocked(root, params, ctx, options);
	}
}


const removeTeamFromUnlocked = {
	type: types.confirmType,
	description: 'Remove a team from the list of unlocked teams for the specified challenge',
	args: {
		key: {
			name: 'key',
			description: 'The key of the challenge to remove the team from',
			type: new GraphQLNonNull(GraphQLString)
		},
		teamId: {
			name: 'teamId',
			description: 'The id of the team to remove',
			type: new GraphQLNonNull(GraphQLID)
		}
	},
	resolve(root, params, ctx, options) {
		return resolvers.challengeResolver.removeTeamFromUnlocked(root, params, ctx, options);
	}
}


const createChallengeItem = {
	type: types.confirmType,
	description: 'Create a challenge item and add it to a challenge',
	args: {
		key: {
			name: 'key',
			description: 'The key of the challenge to create the item in',
			type: new GraphQLNonNull(GraphQLString)
		},
		itemKey: {
			name: 'itemKey',
			description: 'A unique identifier for the challenge item',
			type: new GraphQLNonNull(GraphQLString)
		},
		title: {
			name: 'title',
			description: 'The title of the challenge item',
			type: new GraphQLNonNull(GraphQLString)
		},
		order: {
			name: 'order',
			description: 'The order the challenge item should appear in',
			type: new GraphQLNonNull(GraphQLInt)
		},
		type: {
			name: 'type',
			description: 'The challenge type',
			type: new GraphQLNonNull(GraphQLString)
		}
	},
	resolve(root, params, ctx, options) {
		return resolvers.challengeResolver.createChallengeItem(root, params, ctx, options);
	}
}


const deleteChallengeItem = {
	type: types.confirmType,
	description: 'Delete a challenge item from a challenge',
	args: {
		key: {
			name: 'key',
			description: 'The key of the challenge to delete the item from',
			type: new GraphQLNonNull(GraphQLString)
		},
		itemKey: {
			name: 'itemKey',
			description: 'The key of the challenge item to delete',
			type: new GraphQLNonNull(GraphQLString)
		}
	},
	resolve(root, params, ctx, options) {
		return resolvers.challengeResolver.deleteChallengeItem(root, params, ctx, options);
	}
}


const _editChallengeItemProperty = (description, propertyName, valueType) => {
	return {
		type: types.confirmType,
		description: description,
		args: {
			key: {
				name: 'key',
				description: 'The unique identifier of the challenge to modify',
				type: new GraphQLNonNull(GraphQLString)
			},
			itemKey: {
				name: 'itemKey',
				description: 'The key of the challenge item to modify',
				type: new GraphQLNonNull(GraphQLString)
			},
			value: {
				name: 'value',
				description: `The value to set ${propertyName} to`,
				type: valueType
			}
		},
		resolve(root, params, ctx, options) {
			params.property = propertyName;	// Set the property name
			return resolvers.challengeResolver._editChallengeItemProperty(root, params, ctx, options);
		}
	}
}


const setChallengeItemOrder = _editChallengeItemProperty(
	'Set the order the challenge item should appear in', 'order',
	new GraphQLNonNull(GraphQLInt)
);


const setChallengeItemTitle = _editChallengeItemProperty(
	'Set the challenge item title', 'title',
	new GraphQLNonNull(GraphQLString)
);


const setChallengeItemDescription = _editChallengeItemProperty(
	'Set the challenge item description', 'description',
	new GraphQLNonNull(GraphQLString)
);


const unlockAttempt = {
	type: types.confirmType,
	description: 'Attempt to unlock a challenge',
	args: {
		phrase: {
			name: 'phrase',
			description: 'The passphrase',
			type: new GraphQLNonNull(GraphQLString)
		}
	},
	resolve(root, params, ctx, options) {
		return resolvers.challengeResolver.unlockAttempt(root, params, ctx, options);
	}
}


export default {
	createChallenge,
	deleteChallenge,
	setChallengeOrder,
	setChallengePublic,
	setChallengePassphrase,
	setChallengeTitle,
	setChallengeDescription,
	setChallengeLocked,
	addTeamToUnlocked,
	removeTeamFromUnlocked,
	createChallengeItem,
	deleteChallengeItem,
	setChallengeItemOrder,
	setChallengeItemTitle,
	setChallengeItemDescription,
	unlockAttempt
};
