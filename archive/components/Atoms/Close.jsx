import React from 'react';

export const Close = props => {
	const {
		className,
		size,
		onClick
	} = props;

	return (
		<div className={`Close ${className || ''}`}>
			<div onClick={onClick} className={`CloseButton ${size ? `size-${size}` : ''}`}></div>
		</div>
	);
}