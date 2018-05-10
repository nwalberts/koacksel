# Koacksel

Koacksel is a chat app using ActionCable and React.js, with user authentication via devise and styling with the help of Foundation. It's name is a play on the app name that originally inspired me by enthusiastick (see bottom of page)
To get it up and running locally:

```
$ git clone git@github.com:nwalberts/koacksel.git
$ bundle install
$ rake db:create
$ rake db:migrate
$ rails server
```
And then, in a separate terminal tab:
```
$ npm install
$ npm start
```

#### Redis  
You will also probably need to have a running Redis on your system (e.g. brew install redis.)
If you don't, tasks will likely be asynchronous, and this shouldn't cause too much issue in development, but I can't promise success in production

When you deploy, you will need to configure with Redis on your Heroku Addons.
This doc talks briefly about configuration needed:
Heroku Guide to Action Cable (non-ReactJS)
https://blog.heroku.com/real_time_rails_implementing_websockets_in_rails_5_with_action_cable

When deploying to Heroku, we need to Add Redis To Go add-in. Then update cable.yml to use redis:

adapter: redis
url: YOUR_URL
To find Redis connection URL, run:
heroku config | grep redis

---
### Overview

For every instance of your application that spins up, an instance of Action Cable is created, using Rack to open and maintain a persistent connection, and using a channel mounted on a sub-URI of your main application to stream from certain areas of your application and broadcast to other areas.

Action Cable offers server-side code to broadcast certain content (think new messages or notifications) over the channel, to a subscriber. The subscriber is instantiated on the client-side with a handy JavaScript function that uses jQuery (by default) to append new content to the DOM uses React to append the new content to the DOM.
**Instead of jQuery however, we'll be using React because we are pros**.

Lastly, Action Cable uses Redis as a data store for transient data, syncing content across instances of your application and sending the message out to subscribers.

We’ll need
* the latest version of rails
* redis
* puma

Rails ActionCable Config
* To start this tutorial, make sure to run `rails g channel Chat`, or `rails g challen <YOUR_CHANNEL_NAME>` so that you have the necessary action cable folders. 

React
- componentDidMount has the actionCable code, as well as code that is used to set the user's info in local React state

### Overview
*Web Sockets*
* WebSockets is a computer communications protocol, much like HTTP.
* Wikipedia: "WebSocket is designed to be implemented in web browsers and web servers, but it can be used by any client or server application.  Its only relationship to HTTP is that its handshake is interpreted by HTTP servers as an Upgrade request. The WebSocket protocol enables interaction between a browser and a web server with lower overheads, facilitating real-time data transfer from and to the server. This is made possible by providing a standardized way for the server to send content to the browser without being solicited by the client, and allowing for messages to be passed back and forth while keeping the connection open. In this way, a two-way (bi-directional) ongoing conversation can take place between a browser and the server.""

Publisher/Subscriber
* Pub/Sub, or Publish-Subscribe, refers to a message queue paradigm whereby senders of information (publishers), send data to an abstract class of recipients (subscribers), without specifying individual recipients

### Connections
* When we connect to the app via the server, a Connection object is created that helps facilitate *authentication and authorization.*
* Thus, in the app/channels/application_cable/connection.rb file, we can define any special logic for authorizing the user should we need. This is especially important if you want to limit connections or disconnect the user from existing connections.

```ruby
# app/channels/application_cable/connection.rb
module ApplicationCable
  class Connection < ActionCable::Connection::Base
    identified_by :current_user

    def connect
      self.current_user = find_verified_user
    end

    private
      def find_verified_user
        if verified_user = User.find_by(id: cookies.signed[:user_id])
          verified_user
        else
          reject_unauthorized_connection
        end
      end
  end
end
```

However, this code won't work out of the box, because we don't have access to our session hash the same way we do in controllers. In this case, we have to use cookies via warden_hooks to set up a `current_user` method that will be accessible across all of our channels.

### Signed Cookies
Without going into detail, this will help us set a user's id in cookies upon logging in, remove that cookie if they have been inactive, and also remove it if they log out.

Copy the code below and paste it into `config/initializers/warden_hooks.rb` (which you may need to create). If you start getting odd errors, you may need to install the `warden` gem as well.

```ruby
Warden::Manager.after_set_user do |user,auth,opts|
  scope = opts[:scope]
  auth.cookies.signed["#{scope}.id"] = user.id
  auth.cookies.signed["#{scope}.expires_at"] = 30.minutes.from_now
end

Warden::Manager.before_logout do |user, auth, opts|
  scope = opts[:scope]
  auth.cookies.signed["#{scope}.id"] = nil
  auth.cookies.signed["#{scope}.expires_at"] = nil
end
```


### Channels
* Channels are like our ActionCable controllers. A consumer (the client) can be subscribed to these channels.
* We could then define logic for when a consumer gets subscribed, or disconnected accordingly.

```ruby
# app/channels/chat_channel.rb
class ChatChannel < ApplicationCable::Channel
  # Called when the consumer has successfully
  # become a subscriber of this channel.
  def subscribed
  end
end
```

Regular information can be continually broadcast out to users via a stream. In the case of this app, whenever a user fills out our React form, the message is sent back to our ChatChannel, and then re-broadcast back out to anyone subscribed to that channel.
 This could be particularly useful for those building applications that might rely more heavily on action cable, and could probably be handled even better with Redux.

 Most of the boilerplate files can be generated with e.g. `rails g channel Chat` to create a channel named ChatChannel.

Client-Side JS
* `app/assets/javascripts/cable.js` should be provided for you in newer Rails versions. This helps establish the connection if the subscriber establishes a connection to a channel.
*  `app/assets/javascripts/cable/subscriptions/chat.coffee` can help us define custom scripts based on what happens when connects, disconnects and receives data, however we won't need them since we are setting this up in React.
* You will likely see this in many tutorials, and you can customize your React code accordingly.

---

## Server-side Channel Configuration
Finished code may end up like this.

```ruby
class ChatChannel < ApplicationCable::Channel
  def subscribed
    stream_from "chat_#{params[:chat_id]}"
    # stream_from "chat_channel"
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end

  def receive(data)
    # Our receive method is the most used. Its essentially our endpoint for our Rails app. It can get complex fast though, so continuing to build out private methods that are used below will become important.
    puts data

    chat = Chat.find_or_create_by(id: params[:chat_id])
    chat.messages << Message.create(body: data["message"], user: User.find(data["user"]["user_id"]))

    chat_key = chat.id

    chat_json = {
      "chat_key": chat_key,
      "message": data["message"],
      "user": data["user"]
    }

    ActionCable.server.broadcast("chat_#{params[:chat_id]}", chat_json)
  end

end

```

This class defines the functionality for a channel. There can be multiple instances of this channel at the same time, e.g. for multiple simultaneous chats. The stream_from function will specify an individual instance of this channel to stream from. Here, the subscription (described below) passes a Chat_id param to specify which instance of the Chat channel it wants to stream. For instance, a Chat with ID 5 would, after the string interpolation, resolves to stream_from "Chat_5". If you only have one instance of the channel, you can ignore the parameterization of stream_from and just specify a static string, e.g. stream_from "Chat", at which point all connected clients would stream from the instance called "Chat".

# Client-side

## Creating a subscription

```Javascript
App.ChatChannel = App.cable.subscriptions.create(
  {
    channel: "ChatChannel",
    Chat_id: this.props.ChatId
  },
  {
    connected: () => console.log("ChatChannel connected"),
    disconnected: () => console.log("ChatChannel disconnected"),
    received: data => {
      console.log(data)
    }
  }
);
```
The above code establishes a connection (subscription) with a backend Channel, defined above, and saves it to the variable App.ChatChannel. It is usually best placed in the componentDidMount() function.

If there is only one instance of a channel, the first argument of create() can simply be a string, e.g. `App.ChatChannel = App.cable.subscriptions.create("ChatChannel", ...)`

If there can be multiple parameterized channel instances, you can pass an object as the first parameter, with a key channel specifying the channel to subscribe to, and any additional parameters you want available on the backend via params[]. Here, we pass the ID of the current Chat, so the backend subscription can stream_from the desired stream, e.g. Chat_5.

The second parameter to create is an object whose values are functions. The function assigned to the key received will be run on data received from a backend call to ActionCable.server.broadcast, such as the one above.

Sending a message from the client

To send a message to ActionCable (e.g. to be broadcast to all connected clients), you can run the send() method on the variable you saved the new subscription to, e.g.

```Javascript
App.ChatChannel.send({
  message: "Hello from an ActionCable client!"
})
```
ActionCable calls JSON.stringify on the argument of send(), so it must be a Javascript Object.

There also appears to be a delay between when the subscription is created and when ActionCable will start handling .send() calls. Presumably sent messages will only be handled after the connection has been established, which takes some time after subscription.create() has been called. Importantly, if a message is sent while the connection is still being established, there will be no error messages or other feedback, so one might erroneously conclude that their connection or subscription has not been setup correctly or their .send() call is faulty, when in fact all one needs to do is wait for the connection to be established.

### Handling the sent data on the backend

Calls to .send() on the client will direct to the receive(data) function on the backend, which can handle the data however the developer wishes. In the Channel definition above, a new pair of dice are assigned to the data, and then the data object is broadcast to all clients connected to the stream indicated in the first argument of .broadcast().

As mentioned in the documentation, .broadcast() sends the data to the client that sent the data as well, so the sending client will run the received: function (defined during subscription.create) on the data that it sent out, once it receives it from the backend broadcast() call, just like all the other connected clients. The above code just calls console.log on this data, but one can imagine a state update such as

```Javascript
received: data => {
  this.setState( {messages: [...this.state.messages, data]} )
}
```
if the data was a chat message that one wanted to append to an array of messages (Which we do in koacksel :)

### Heroku

Heroku requires Redis to be setup (if you wish to use Redis), which can be done by following the documentation.

The config/cable.yml file will also need to be updated with the new Redis URL for Heroku. This url can be found by running heroku config | grep REDIS.

---

An enormous amount of credit should be given to ethusiastic, whose implementation this strongly leans on.
https://github.com/enthusiastick/coaxial

Just as much credit goes to a former student of mine, stenagli, who solved a handful of config issues in his own work.
https://gist.github.com/stenagli/2876b3ca3f05c37d1dc1e08ac3d3db75

ActionCable Docs
http://edgeguides.rubyonrails.org/action_cable_overview.html

Alt-Demo of ActionCable with ReactJS
https://viblo.asia/p/using-reactjs-with-rails-action-cable-MJykjWZYvPB

In-depth video on ActionCable
https://www.youtube.com/watch?v=n0WUjGkDFS0&t=1154s

Rails API Docs as a resource
http://api.rubyonrails.org/classes/ActionCable/Channel/Base.html

Really Nice Cable Demo (non-ReactJS)
https://www.youtube.com/watch?v=tyNepRO_ERc

ActionCable with Devise
http://www.shawnwang.net/1168.html
https://blog.adamzolo.com/action-cable-devise-heroku/
