import React, { Component } from 'react';
import ChatMessage from '../components/ChatMessage';
import TextFieldWithSubmit from '../components/TextFieldWithSubmit';


class ChatContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chats: [],
      message: ''
    }

    this.handleChatReceipt = this.handleChatReceipt.bind(this);
    this.handleClearForm = this.handleClearForm.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.handleMessageChange = this.handleMessageChange.bind(this);
  }

  componentDidMount() {
    App.room = App.cable.subscriptions.create("ChatChannel", {
      received: function(data) {
        this.handleChatReceipt(data);
      },

      speak: function(data) {
        console.log(this)
        this.perform('speak', data)
      },

      handleChatReceipt: this.handleChatReceipt
    })
  }

  handleChatReceipt(chat) {
    this.setState({ chats: this.state.chats.concat(chat) })
  }

  handleClearForm() {
    this.setState({ message: '' })
  }

  handleFormSubmit(event) {
    event.preventDefault();
    let payload = JSON.stringify({
      message: this.state.message
    });

    // instead of using a fetch request, I would want to call the App.room.speak method to send the payload back through Websockets

    fetch('/api/v1/messages.json', {
      credentials: 'same-origin',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: payload
    })
    .then((response) => {
      let { ok } = response;
      if (ok) {
        return response.json();
      }
    })
    .then((data) => {
      this.handleClearForm();
    })
  }

  handleMessageChange(event) {
    this.setState({ message: event.target.value })
  }

  render() {
    let chats = this.state.chats.map(chat => {
      return(
        <ChatMessage
          key={chat.key}
          handle={chat.handle}
          message={chat.message}
          icon={chat.icon_num}
        />
      )
    });

    return(
      <div>
        <div className='callout chat' id='chatWindow'>
          {chats}
        </div>
        <form onSubmit={this.handleFormSubmit}>
          <TextFieldWithSubmit
            content={this.state.message}
            name='message'
            handlerFunction={this.handleMessageChange}
          />
        </form>
      </div>
    );
  }
}

export default ChatContainer;
