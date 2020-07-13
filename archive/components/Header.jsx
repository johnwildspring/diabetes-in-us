import React from 'react';

import './Header.sass';

export const Header = props => {
	return (
		<header className="Header vertical-align">
			<div className="Logo vertical-align">
				<img src="/assets/republic.png" />
			</div>
			<div className="Actions">
				{/* <button className="Button Primary">Sign Up</button>
				<button className="Button Alt">Log In</button> */}
			</div>
		</header>
	)
};