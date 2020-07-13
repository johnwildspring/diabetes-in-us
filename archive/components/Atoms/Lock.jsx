import React from 'react';

export const Lock = props => {
	const { onClick, locked } = props;
	return (
		<div className="Lock">
			<img className={!locked ? 'unlocked' : ''} src={`/assets/${!locked ? 'un' : ''}locked.svg`} onClick={onClick} />
		</div>
	);
};