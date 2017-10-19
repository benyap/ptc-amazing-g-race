import Mongo from 'mongodb';
import connect from '../connect';


const _randIndex = function(limit) {
	return Math.floor(Math.random() * limit);
}


const _generateStory = async function(type, content, iconName = '', intent = 'none', teamName, teamId) {
	const db = await connect();
	console.log('GENERATING STORY');
	// Create story object
	const story = {
		_id: new Mongo.ObjectID(),
		type,
		createDate: new Date(),
		createdBy: '',
		publishDate: null,
		published: false,
		iconName,
		content,
		intent,
		edited: false,
		likes: [],
		teamId
	}
	db.collection('stories').insert(story);

	// Log action
	const action = {
		action: 'Generate story',
		target: story._id,
		targetCollection: 'stories',
		who: 'system-generated',
		date: new Date(),
		infoJSONString: JSON.stringify({
			type,
			iconName,
			content,
			intent,
			teamName,
			teamId
		})
	};
	db.collection('actions').insert(action);
}


const challengeUnlockStory = function(teamName, teamId) {
	const PHRASES = [
		`#### Open sesame!\n${teamName} just unlocked a new challenge! Could they be in the lead?`,
		`#### Open sesame!\nA team just unlocked a new challenge! Could they be in the lead?`,
		`#### Progress...\nA new challenge was unlocked by a team! How is your team going?`,
		`#### Progress...\nA new challenge was unlocked by ${teamName}! How is your team going?`,
		`#### Are you keeping up?\nLooks like somebody just unlocked a new challenge! Don't lag behind!`,
		`#### Going strong!\nA team just made some good progress by unlocking a new challenge!`,
		`#### Going strong!\n${teamName} just made some good progress by unlocking a new challenge!`,
		`#### Keep it up!\n${teamName} got something right and earned themselves a new challenge! Are you keeping up?`
	];

	_generateStory(
		'challengeUnlock',
		PHRASES[_randIndex(PHRASES.length)],
		'unlock',
		'warning',
		teamName, teamId
	);
}


const challengeRespondStory = function(teamName, teamId) {
	const PHRASES = [
		`#### A challenge was answered!\nA team just submitted a response. Will they get it right?`,
		`#### They've taken their chances!\nA team just submitted a repsonse and they'll soon find out if they were right!`,
		`#### Someone's making progress...\nA team just submitted a response. How is your team going?`,
		`#### Someone's making progress...\n${teamName} just submitted a response. How is your team going?`,
		`#### You have competition!\nA team just submitted a response to a challenge - let's see if they got it right...`,
		`#### Watch out!\n${teamName} just responded to a challenge. You better keep up!`,
		`#### Watch out!\nA team just responded to a challenge. You better keep up!`,
	];

	_generateStory(
		'challengeRespond',
		PHRASES[_randIndex(PHRASES.length)],
		'upload',
		'warning',
		teamName, teamId
	);
}


const challengeCheckStory = function(teamName, teamId) {
	const PHRASES = [
		`#### Hammertime!\nThe judges just gave a verdict on a ${teamName}'s response...`,
		`#### Hammertime!\nThe judges have spoken. Someone just found out if they got an answer right.`,
		`#### Progress?\nA team's response just got judged. Were they right, or did they just lose time?`,
		`#### Progress?\n${teamName}'s response just got judged. Were they right, or did they just lose time?`,
		`#### Judged!\n${teamName} just found out if they answered a challenge correctly! How is your team going?`,
		`#### Judged!\nA team just found out if they answered a challenge correctly! How is your team going?`
	];

	_generateStory(
		'challengeCheck',
		PHRASES[_randIndex(PHRASES.length)],
		'take-action',
		'warning',
		teamName, teamId
	);
}


export default {
	challengeUnlockStory,
	challengeRespondStory,
	challengeCheckStory
}
