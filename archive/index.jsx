import React from 'react';
import ReactDOM from 'react-dom';
// import { Router, Route, IndexRoute, Redirect, browserHistory } from 'react-router';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';

import 'styles/base.sass';

import { Header } from 'components/Header.jsx';
import { MapViz } from 'components/MapViz.jsx';
import { Store } from 'contexts';

const App = props => {
	return (
		<Store>
			<Router>
				<React.Fragment>
					<Header />
					<Switch>
						<Route path="/" render={router => <MapViz />} />
						{/* <Route path="/new/:action?/:id?" render={router => <MapMaker router={router} />} />
						<Redirect to="/new" /> */}
					</Switch>
				</React.Fragment>
			</Router>
		</Store>
	);
};

ReactDOM.render(
	<App />,
	document.getElementById('root')
);