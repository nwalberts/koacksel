import React, { Component } from 'react';
import ChatMessage from '../components/ChatMessage';
import TextFieldWithSubmit from '../components/TextFieldWithSubmit';


class ChatContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {
        handle: "",
        icon_num: ""
      },
      chats: [],
      message: '',
    }

    this.handleChatReceipt = this.handleChatReceipt.bind(this);
    // this.handleClearForm = this.handleClearForm.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.handleMessageChange = this.handleMessageChange.bind(this);
  }

  componentDidMount() {
    // let payload = JSON.stringify({
    //   message: this.state.message
    // });
    // fetch('/api/v1/users.json', {
    //   credentials: 'same-origin',
    //   method: 'GET',
    //   headers: { 'Content-Type': 'application/json' }
    // })
    // .then((response) => {
    //   let { ok } = response;
    //   if (ok) {
    //     return response.json();
    //   }
    // })
    // .then((data) => {
    //   console.log(data)
    //   this.setState({user: data})
    App.gameChannel = App.cable.subscriptions.create(
      {
        channel: "GameChannel",
        game_id: 1
      },
      {
        connected: () => console.log("GameChannel connected"),
        disconnected: () => console.log("GameChannel disconnected"),
        received: data => {
          // console.log(data)
          this.handleChatReceipt(data)
        }
      }
    );
    // })
    // App.room = App.cable.subscriptions.create("ChatChannel", {
    // })

    // this takes two arguments, the name/details of your channel as either an object or string,
    // and methods that correspond with channel events
  }

  handleChatReceipt(chat) {
    // debugger;
    this.setState({ chats: this.state.chats.concat(chat) })
  }

  getCurrentUser() {
    // let payload = JSON.stringify({
    //   message: this.state.message
    // });
    // fetch('/api/v1/users.json', {
    //   credentials: 'same-origin',
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' }
    // })
    // .then((response) => {
    //   let { ok } = response;
    //   if (ok) {
    //     return response.json();
    //   }
    // })
    // .then((data) => {
    //   this.setState({user: data})
    // })
  }

  // handleClearForm() {
  //   this.setState({ message: '' })
  // }

  handleFormSubmit(event) {
    // event.preventDefault();
    // note, instead of having to make a fetch, we use ActionCable
    let prepMessage = this.state.message
    App.gameChannel.send({
     message: prepMessage,
     nicks_message: "booyaga"
    })
    // this.handleClearForm();
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
          handle={chat.handle}
          message={chat.message}
          icon="1"
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
