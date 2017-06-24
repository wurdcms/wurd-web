import React, {Component} from 'react';
import wurd from '../wurd';
import {Text, Image, List} from './wurd';


class App extends Component {

  render() {
    return (
      <div>
        <Image id="simple.image" width="100%" />

        <h1><Text id="simple.title" /></h1>

        <Text id="simple.intro" markdown />

        <hr />

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
