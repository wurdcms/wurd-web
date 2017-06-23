import React, {Component} from 'react';
import wurd from '../wurd';
import Text from './wurd-text';
import List from './wurd-list';


class App extends Component {

  render() {
    return (
      <div>
        <h1><Text id="react.title" /></h1>

        <Text id="react.intro" markdown vars={{name: 'John'}} />

        <h2><Text id="react.team.title" /></h2>
        <List id="react.team.items">
          <Text type="h3" id=".name" />
          <Text id=".position" />
        </List>
      </div>
    );
  }

};


export default App;
