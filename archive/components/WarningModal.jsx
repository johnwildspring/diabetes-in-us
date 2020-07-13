import React from 'react';

import { Close } from './Atoms/Close.jsx';

import './WarningModal.sass';


export const WarningModal = props => {
	return (
		<div className={`WarningModal ${props.className || ''}`}>
			<div className="bg" style={props.bg ? {background: props.bg} : {}}>
				{props.onClose ? <Close onClick={e => props.onClose(e)} /> : null}

				{props.largeText ? <h4 className="Title spacer-bottom-2">{props.largeText}</h4> : null}
  				{props.smallText ? <label className="SmallText spacer-bottom-2">{props.smallText}</label> : null}
				{props.message ? <div className="Message spacer-bottom-2">{props.message}</div> : null }
				{props.warningText ? <label className="Warning spacer-bottom-2">{props.warningText}</label> : null}
				{props.children}

				<div className="buttons spacer-top-1">
					{props.negative ? <button className="Button" onClick={e => props.onClose(e)}>{props.negative}</button> : null}
					{props.affirmative ? <button className="Button Danger" onClick={e => props.onAffirm(e)}>{props.affirmative}</button> : null}
				</div>
			</div>
		</div>
	)
};
