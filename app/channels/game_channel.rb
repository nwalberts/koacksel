class GameChannel < ApplicationCable::Channel
  def subscribed
    # stream_from "some_channel"
    stream_from "game_#{params[:game_id]}"
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end

  def receive(data)
    # ActionCable.server.broadcast "chat_channel", message: data[:message], handle: "Mr. Random", icon_num: 1, key: "#{Time.now.to_datetime.strftime('%Q')}-#{current_user.id}"
    # unless data[message].length == 0
    #
    # end
    data["chat_key"] = "#{Time.now.to_datetime.strftime('%Q')}-#{current_user.id}"


    ActionCable.server.broadcast("game_#{params[:game_id]}", data)
    puts data
    # binding.pry
  end
end

# If we are using a game board, we would like have some Game object here
# The channel would be opened with a param of that Game's id
# Any time the game board changed, we could broadcast to this Gamechannel,
# find the corresponding game, and update its attributes

# For these chats, I would have to make a "Discussion" object, that has many "Messages"
# I would then take the Discussion id, get the discussion, and add an associated messaged
# On componentDidMount, I could then grab all of the messages for this Discussion so that no one misses out
