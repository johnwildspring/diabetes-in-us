/** @jsx jsx */
import { useState } from 'react';
import { jsx } from 'theme-ui'

import { MapComponent } from './components/Map';
import { Legend } from './components/Legend';
import { HoverValue } from './components/HoverValue';

function App() {
  const [ hovered, setHover ] = useState(null);
  
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
      <MapComponent hovered={hovered} setHover={setHover} />
      <Legend start={0} end={33} />
      <HoverValue value={hovered} />
    </div>
  );
}

export default App;
