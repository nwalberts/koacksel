import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import ChatContainer from './containers/ChatContainer';


$(function() {
  ReactDOM.render(
    <ChatContainer />,
    document.getElementById('app')
  );
});
