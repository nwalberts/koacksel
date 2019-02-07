class Api::V1::MessagesController < Api::ApiController
  
end

# DEFUNCT CODE FROM ANOTHER AGE

# def create
#   if params[:message].present?
#     ActionCable.server.broadcast "chat_channel", message: params[:message], handle: current_user.handle, icon_num: assign_icon_num, key: "#{Time.now.to_datetime.strftime('%Q')}-#{current_user.id}"
#     render json: { message: params[:message], handle: current_user.handle }, status: :accepted
#   else
#     render json: { errors: "bad request" }, status: :bad_request
#   end
# end
# private
#
# def assign_icon_num
#   if current_user.icon_num.nil?
#     rando = rand(1..4)
#     current_user.update(icon_num: rando)
#   else
#     current_user.icon_num
#   end
# end
