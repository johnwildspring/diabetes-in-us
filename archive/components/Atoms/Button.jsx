import React from 'react';

export const Button = props => {
	const {
		children,
		className,
		onClick,
		inactive
	} = props;
	return (
		<button onClick={!inactive ? onClick : null} className={`Button ${inactive ? 'inactive' : ''} ${className}`}>{children}</button>
	)
}