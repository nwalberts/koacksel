class ChatChannel < ApplicationCable::Channel
  def subscribed
    # stream_from "some_channel"
    # binding.pry
    stream_from "chat_#{params[:chat_id]}"
    # stream_from "chat_channel"
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end

  def receive(data)
    puts data

    chat_key = "#{Time.now.to_datetime.strftime('%Q')}-#{current_user.id}"

    chat_json = {
      "chat_key": chat_key,
      "message": data["message"],
      "user": data["user"]
    }

    ActionCable.server.broadcast("chat_#{params[:chat_id]}", chat_json)
  end

end

# For these chats, I would have to make a "Discussion" or "Chat" object, that has many "Messages"
# I would then take the Discussion id, get the discussion, and add an associated messaged
# On componentDidMount, I could then grab all of the messages for this Discussion so that no one misses out
