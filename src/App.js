/** @jsx jsx */
import { jsx } from 'theme-ui'

import { MapComponent } from './components/Map';
import { Legend } from './components/Legend';

function App() {
  return (
    <div className="App">
      {/* <header sx={{
        zIndex: 1000,
        position: 'fixed',
        top: 0,
        width: '100%',
        height: '60px'
      }}>
        Test
      </header> */}
      <MapComponent />
      <Legend start={0} end={33} />
    </div>
  );
}

export default App;
