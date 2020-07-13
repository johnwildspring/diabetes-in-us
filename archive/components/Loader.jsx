import React from 'react';

export const Loader = props => {
	return (
		<div className={`Loader lds-css ${props.className || ''}`}>
			<div className="lds-eclipse">
				<span className="LoaderText">{props.text}</span>
				<div style={{
					boxShadow: `0 4px 0 0 ${props.color || '#2646DF'}`
				}}></div>
			</div>
			<style type="text/css">{`@keyframes lds-eclipse {
				0% {
					-webkit-transform: rotate(0deg);
					transform: rotate(0deg);
				}
				50% {
					-webkit-transform: rotate(180deg);
					transform: rotate(180deg);
				}
				100% {
					-webkit-transform: rotate(360deg);
					transform: rotate(360deg);
				}
				}
				@-webkit-keyframes lds-eclipse {
				0% {
					-webkit-transform: rotate(0deg);
					transform: rotate(0deg);
				}
				50% {
					-webkit-transform: rotate(180deg);
					transform: rotate(180deg);
				}
				100% {
					-webkit-transform: rotate(360deg);
					transform: rotate(360deg);
				}
				}
				.lds-eclipse {
				position: relative;
				display: flex;
				justify-content: center;
				align-items: center;
				text-align: center;
				}
				.lds-eclipse div {
				position: absolute;
				-webkit-animation: lds-eclipse 1s linear infinite;
				animation: lds-eclipse 1s linear infinite;
				width: 160px;
				height: 160px;
				top: 20px;
				left: 20px;
				border-radius: 50%;
				-webkit-transform-origin: 80px 82px;
				transform-origin: 80px 82px;
				}
				.lds-eclipse {
				width: 200px !important;
				height: 200px !important;
				-webkit-transform: translate(-100px, -100px) scale(1) translate(100px, 100px);
				transform: translate(-100px, -100px) scale(1) translate(100px, 100px);
				}
				.LoaderText {
					max-width: 50%;
				}
			`}
			</style>
		</div>
	)
}