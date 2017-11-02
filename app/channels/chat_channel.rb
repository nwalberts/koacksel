class ChatChannel < ApplicationCable::Channel
  def subscribed
    stream_from "chat_channel"
  end

  def unsubscribed
    stop_all_streams
  end

  # OG channel, which I will soon move my code into ;)
  def speak(data)
    # binding.pry
    # here, instead of broadcasting a message, I could save a Message object into my database. The message would belong to a Chatroom object. Then, in the subscribed metod, I could stream any changes from that Chatoom

    #  Note, I wont have access to current user here. Only the data that was passed. ActionCable annoyingly can only be configured with cookies, and I havent gotten that up and running yet. You can either pass up the data from your messagescontroller and through, or configure cookies.

    # ActionCable.server.broadcast "chat_channel", message: data[:message], handle: current_user.handle, icon_num: 1, key: "#{Time.now.to_datetime.strftime('%Q')}-#{current_user.id}"
  end
end
