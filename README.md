# Koacksel

Koacksel is a chat app using ActionCable and React.js, with user authentication via devise and styling with the help of Foundation. To get it up and running locally:

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
You will also need to have a running Redis on your system (e.g. brew install redis.)

When you deploy, you will need to configure with Redis on your Heroku Addons .
This doc talks briefly about configuration needed:
Heroku Guide to Action Cable (non-ReactJS)
https://blog.heroku.com/real_time_rails_implementing_websockets_in_rails_5_with_action_cable

When deploying to Heroku, we need to Add Redis To Go add-in. Then update cable.yml to use redis:

adapter: redis
url: YOUR_URL
To find Redis connection URL, run:
heroku config | grep redis

---

For every instance of your application that spins up, an instance of Action Cable is created, using Rack to open and maintain a persistent connection, and using a channel mounted on a sub-URI of your main application to stream from certain areas of your application and broadcast to other areas.

Action Cable offers server-side code to broadcast certain content (think new messages or notifications) over the channel, to a subscriber. The subscriber is instantiated on the client-side with a handy JavaScript function that uses jQuery to append new content to the DOM uses React to append the new content to the DOM.

Lastly, Action Cable uses Redis as a data store for transient data, syncing content across instances of your application and sending the message out to subscribers.

We’ll need
* the latest version of rails
* redis
* puma

Rails ActionCable Config
* A channels folder should be present in our app

React
- componentDidMount has the actionCable code

Overview
Web Sockets
* WebSocket is a computer communications protocol, much like HTTP.
* Wikipedia: "WebSocket is designed to be implemented in web browsers and web servers, but it can be used by any client or server application.  Its only relationship to HTTP is that its handshake is interpreted by HTTP servers as an Upgrade request. The WebSocket protocol enables interaction between a browser and a web server with lower overheads, facilitating real-time data transfer from and to the server. This is made possible by providing a standardized way for the server to send content to the browser without being solicited by the client, and allowing for messages to be passed back and forth while keeping the connection open. In this way, a two-way (bi-directional) ongoing conversation can take place between a browser and the server.""

Publisher/Subscriber
* Pub/Sub, or Publish-Subscribe, refers to a message queue paradigm whereby senders of information (publishers), send data to an abstract class of recipients (subscribers), without specifying individual recipients

Connections
* When we connect to the app via the server, a Connection object is created that helps facilitate authentication and authorization.
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

Channels
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

Regular information can be continually broadcast out to users via a stream. In my example, we broadcast whenever the Messages create action is hit, but I could also set up my channel such that whenever a new Message is created for a specific chatroom, that message gets sent along to any subscribers of the channel. This could be particularly useful for those building applications that might rely more heavily on action cable

Client-Side JS
* `app/assets/javascripts/cable.js` should be provided for you in newer Rails versions. This helps establish the connection if the subscriber establishes a connection to a channel.
*  `app/assets/javascripts/cable/subscriptions/chat.coffee`
* can help us define custom scripts based on what happens when connects, disconnects and receives data
* You will likely see this in many tutorials. Instead of configuring this JS file, we can instead do much the same inside of our React component

---

An enormous amount of credit should be given to ethusiastic, whose implementation this strongly leans on.
https://github.com/enthusiastick/coaxial

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
