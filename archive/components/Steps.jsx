import React from 'react';

import './Steps.sass';

const Step = props => {
	return (
		<div className={`Step spacer-bottom-1 ${props.active ? 'active' : ''}`}>
			<h4>Step {props.num}: {props.title}</h4>
			<div className={`Instructions ${props.active ? 'active' : ''}`}>{props.instructions}</div>
		</div>
	)
}

export const Steps = props => {
	const { points } = props.ctx;

	// return (
	// 	<div className="Steps">
	// 		{points.size == 0 ?
	// 			<React.Fragment>
	// 				<h4>Step 1: Add locations</h4>
	// 				<p>Click anywhere on the map to drop a pin and start building a location collection</p>
	// 			</React.Fragment>
	// 		:
	// 			<React.Fragment>
	// 				<h4>Step 2: Add components (optional)</h4>
	// 				<p>Drag components onto your map and configure them to allow your audience to interact with your map</p>
	// 				<h4>Step 3: Preview and share your map</h4>
	// 				<p>See what your audience will see and share your map via email, SMS, or Facebook Messenger</p>
	// 			</React.Fragment>	
	// 		}
	// 	</div>
	// )

	const steps = [
		{
			title: 'Add locations',
			// instructions: 'Click anywhere on the map to drop a pin and start building a location collection',
			instructions: (
				<div>
					<p className="spacer-bottom-1">Click anywhere on the map to drop a pin and start building a collection of locations</p>
					<div>
						<div className="inline spacer-right-2">
							<img src="/assets/mouse-left.svg" width="32px" height="32px" /><span>Drop pin</span>
						</div>
						<div className="inline">
							<img src="/assets/mouse-right.svg" width="32px" height="32px" /><span>Delete pin</span>
						</div>
					</div>
				</div>
			),
			active: points.size == 0
		},
		{
			title: 'Install components',
			instructions: 'Drag & drop components onto your map to allow your audience to interact with your map',
			active: points.size > 0
		},
		{
			title: 'Preview and Share',
			instructions: 'See what your audience will see and share your map via email, SMS, or Facebook Messenger',
			active: points.size > 0
		}
	];

	return (
		<div className="Steps">
			{steps.map((step, index) => <Step {...step} num={index+1} key={index}/>)}
		</div>
	)
}