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
      this.setState({user: data})
    })

    App.gameChannel = App.cable.subscriptions.create(
      // Info that is sent to the subscribed method
      {
        channel: "ChatChannel",
        chat_id: 1
        // If you had router, you could do:
        // game_id: this.props.params["id"]
      },
      {
        connected: () => console.log("ChatChannel connected"),
        disconnected: () => console.log("ChatChannel disconnected"),
        received: data => {
          // Data broadcasted from the chat channel
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

    // Send info to the receive method on the back end
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
    let chats = this.state.chats.map(chat => {
      return(
        <ChatMessage
          key={chat.key}
          handle={chat.user.handle}
          icon={chat.user.icon_num}
          message={chat.message}
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
