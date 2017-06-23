import React, {Component} from 'react';
import Text from './wurd-text';

class App extends Component {

  render() {    
    return (
      <div>
        <h1><Text id="react.title" /></h1>

        <Text id="react.intro" markdown />
      </div>
    );
  }

};


export default App;
