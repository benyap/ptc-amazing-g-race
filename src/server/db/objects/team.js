import Mongo from 'mongodb';
import connect from '../connect';
import permission from '../permission';


/**
 * Get the a team from the database by Id
 * @param {*} user 
 * @param {String} teamId 
 */
const getTeam = async function(user, teamId) {
	if (!user) return new Error('No user logged in');

	const authorized = await permission.checkPermission(user, ['user:view-teams']);
	if (authorized !== true) return authorized;
	
	const db = await connect();
	const team = await db.collection('teams').findOne({_id: Mongo.ObjectID(teamId)});
	
	if (!team) {
		return Error(`Team with id \'${teamId}\' not found.`);
	}

	return team;
}


/**
 * Get the a team from the database by Id
 * @param {*} user 
 * @param {String} teamId 
 */
const getTeams = async function(user, skip = 0, limit = 0) {
	if (!user) return new Error('No user logged in');

	const authorized = await permission.checkPermission(user, ['user:view-teams']);
	if (authorized !== true) return authorized;
	
	const db = await connect();
	return db.collection('teams').find({}).skip(skip).limit(limit).toArray();
}


/**
 * Add a new team to the database
 * @param {*} user 
 * @param {String} teamName 
 */
const addTeam = async function(user, teamName) {
	if (!user) return new Error('No user logged in');

	const authorized = await permission.checkPermission(user, ['admin:add-team']);
	if (authorized !== true) return authorized;

	if (!teamName) {
		return new Erorr('Team name is required.');
	}

	const db = await connect();
	
	// Check that team name is unique
	const teamNameCheck = await db.collection('teams').findOne({teamName});
	if (teamNameCheck) {
		return new Error(`A team with the name \'${teamName}\' already exists.`);
	}

	// Create team
	const team = {
		_id: new Mongo.ObjectID(),
		teamName,
		points: 0
	}

	db.collection('teams').insert(team);

	// Log action
	const action = {
		action: 'Create team',
		target: 'teamName',
		targetCollection: 'teams',
		date: new Date(),
		who: user.username,
		infoJSONString: JSON.stringify({ teamName: team.teamName, teamId: team._id })
	};

	db.collection('actions').insert(action);
	
	return { 
		ok: true,
		action: action
	}
}


/**
 * Remove a team
 * @param {*} user 
 * @param {String} teamName 
 */
const removeTeam = async function(user, teamName) {
	if (!user) return new Error('No user logged in');

	const authorized = await permission.checkPermission(user, ['admin:add-team']);
	if (authorized !== true) return authorized;

	if (!teamName) {
		return new Erorr('Team name is required.');
	}

	const db = await connect();
	
	// Check that team exists
	const teamNameCheck = await db.collection('teams').findOne({teamName});
	if (!teamNameCheck) {
		return new Error(`A team with the name \'${teamName}\' does not exist.`);
	}

	// Check that team has 0 members
	let members = await db.collection('users').find({teamId: Mongo.ObjectID(teamNameCheck._id)}).toArray();
	if (members.length > 0) {
		return new Error(`The team \'${teamName}\' still has ${members.length} member(s), you cannot remove this team.`);
	}
	
	// Remove team
	db.collection('teams').remove({teamName});

	// Log action
	const action = {
		action: 'Remove team',
		target: 'teamName',
		targetCollection: 'teams',
		date: new Date(),
		who: user.username,
		infoJSONString: JSON.stringify({ teamName: teamNameCheck.teamName, teamId: teamNameCheck._id })
	};

	db.collection('actions').insert(action);
	
	return { 
		ok: true,
		action: action
	}
}


export default {
	getTeam,
	getTeams,
	addTeam,
	removeTeam
}
