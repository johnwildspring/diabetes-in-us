import React from 'react';

import { Close } from './Close.jsx';

export const Tag = props => {
	const {
		className,
		text,
		onClick,
		onClose
	} = props;

	return <span onClick={onClose || onClick || null} className={`Tag ${className}`}>{text} {onClose ? <Close onClose={onClose} size="8" className="inline-block" /> : null}</span>;
}