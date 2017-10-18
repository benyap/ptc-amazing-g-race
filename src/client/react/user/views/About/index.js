import React from 'react';
import { Link } from 'react-router-dom';


class About extends React.Component {
	render() {
		return (
			<main id='about' className='dashboard'>
				<div className='content'>
					<h2>About</h2>

					<p>
						This website and all its content was brought to you by the Amazing GRace planning team.
						We hope you enjoy your stay and have a wonderful time celebrating the end of the year with us!
					</p>
					<p>
						By using this website and uploading photos to it, you are giving us permission repost them on the&nbsp;
						<a href='https://www.facebook.com/events/131023924193281'>Facebook event page</a>.
						If you have any concerns about your privacy and the information you have submitted to this webiste,
						please contact the <Link to='/dashboard/contacts'>website administrator</Link>.
					</p>

					<h4>Data Usage</h4>
					<p>
						This web app was built using the <a href='https://reactjs.org'>React.js</a> framework as a <em>Single Page Application</em>.
						If that doesn't mean anything to you, that's okay - all you need to know is that once you've loaded the website once, 
						you don't need to download it again unless you clear your cache, or the website is updated (this will not happen on the day of the event). 
					</p>
					<p>
						This means if you loaded this website at home at least once before coming to the event,
						you'll save a bit of data as the website will already be downloaded. 
						It will only use your data it needs to send or retreive NEW information.
						Examples of this include: 
					</p>
					<ul style={{paddingLeft:'1rem'}}>
						<li>When you open up a challenge you have not opened before</li>
						<li>When you press the refresh button to get the latest stats</li>
						<li>When you upload a photo</li>
					</ul>
					<p>
						Efforts have been made to reduce data usage by the website as much as possible.
						That being said, we are not responsible for any data charges as a result of using this website. 
					</p>
					<p>
						You can expect to use anywhere from 5MB to 30MB through this website on the day of the event, 
						depending on how many challenges you view and how many images you upload. 
						This does not account for the Snapchats you will send to your friends.
					</p>

					<h4>Finer details</h4>
					<p>
						Okay, here are the really nitty gritty details, just in case you were interested.
						Please keep in mind that these are approximations.
						Some of these assets are cached and only need to be loaded once.
					</p>
					<p>
						The assets required to load the page come to a total of just under 1.5MB. 
						These assets are cached so after the first time the page loaded, 
						subsequence page reloads will only cost a few kB.
					</p>
					<p>
						Refreshing the team points display and team responses display takes less than 1kB.
						Refreshing other components such as the challenges list or newsfeed may take up to 10kB.
					</p>
					<p>
						Loading any of the other pages via the user's dashboard menu can take anywhere from less than 1kB up to 10kB.
						This should cost roughly the same amount of data as using the refresh buttons.
					</p>
					<p>
						Loading a challenge description that includes images may take several hundred kB per challenge.
						Images are cached so they only need to be downloaded once.
						If there are no images, it should only take a few kB.
					</p>
					<p>
						Image uploads will vary depending on the size of your image. 
						The image uploader will tell you the size of your upload.
					</p>
				</div>
			</main>
		);
	}
}


export default About;
