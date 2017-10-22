class GameChannel < ApplicationCable::Channel
  def subscribed
    # stream_from "some_channel"
    stream_from "game_#{params[:game_id]}"
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end

  def receive(data)
    ActionCable.server.broadcast "chat_channel", message: data[:message], handle: "Mr. Random", icon_num: 1, key: "#{Time.now.to_datetime.strftime('%Q')}-#{current_user.id}"


    ActionCable.server.broadcast("game_#{params[:game_id]}", data)
    puts data
    # binding.pry
  end
end


































# turn_and_dice = data["turn_and_dice"]

# die1 = rand(1..6)
# die2 = rand(1..6)

# bits 1-3 are die1, 4-6 die2, 7 whether white's turn
# turn_and_dice |= (die1 | (die2 << 3))
# turn_and_dice = "howdy howdy howdy"
# data["turn_and_dice"] = turn_and_dice
