import React, { Component } from 'react';
import ChatMessage from '../components/ChatMessage';
import TextFieldWithSubmit from '../components/TextFieldWithSubmit';


class ChatContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
      chats: [],
      message: ''
    }

    this.handleChatReceipt = this.handleChatReceipt.bind(this);
    this.handleClearForm = this.handleClearForm.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.handleMessageChange = this.handleMessageChange.bind(this);
  }

  componentDidMount() {
    // App.room = App.cable.subscriptions.create("ChatChannel", {
    // })
    fetch('/api/v1/users', {
      credentials: 'same-origin',
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })
    .then((response) => {
      let { ok } = response;
      if (ok) {
        return response.json();
      }
    })
    .then((data) => {
      console.log(data)
      this.setState({user: data})
    })

    App.gameChannel = App.cable.subscriptions.create(
      {
        channel: "GameChannel",
        game_id: 1
      },
      {
        connected: () => console.log("GameChannel connected"),
        disconnected: () => console.log("GameChannel disconnected"),
        received: data => {
          console.log(data)
          this.handleChatReceipt(data)
        }
      }
    );
  }

  handleChatReceipt(chat) {
    this.setState({ chats: this.state.chats.concat(chat) })
  }

  handleClearForm() {
    this.setState({ message: '' })
  }

  handleFormSubmit(event) {
    event.preventDefault();
    let prepMessage = this.state.message
    let user_info = this.state.user

    App.gameChannel.send({
     message: prepMessage,
     user: user_info
    })

    this.handleClearForm();
  }

  handleMessageChange(event) {
    this.setState({ message: event.target.value })
  }

  render() {
    console.log(this.state)
    let chats = this.state.chats.map(chat => {
      return(
        <ChatMessage
          key={chat.key}
          message={chat.message}
          handle={chat.user.handle}
          icon={chat.user.icon_num}
        />
      )
    }, this);

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
