import React from 'react';
import { railsAssetImagePath } from '../constants/railsAssetImagePath';


const ChatMessage = ({ handle, message, icon }) => {
  return(
    <p>
      <img src={railsAssetImagePath(`chat_image_${icon}`)} width="40"/>
      <strong> {handle}: </strong>
      {message}
    </p>
  );
};

export default ChatMessage;
