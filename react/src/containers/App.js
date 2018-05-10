import React from 'react';
import { Router, browserHistory, Route, IndexRoute } from 'react-router';
import NavBar from './components/NavBar';
import ChatContainer from './ChatContainer';

const App = props => {
  return(
    <Router history={browserHistory}>
      <Route path='/' component={NavBar} >
        <Route path="chats/:id" component={ChatContainer}/>
      </Route>
    </Router>
  )
}

export default App;
