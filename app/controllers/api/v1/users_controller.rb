class Api::V1::UsersController < Api::ApiController

  def index
    # binding.pry

    # user_json = {
    #   user_id: current_user.id,
    #   handle: current_user.handle,
    #   icon_num: current_user.icon_num
    # }
    # binding.pry
    render json: { user_id: current_user.id, handle: current_user.handle, icon_num: current_user.icon_num }.as_json
  end


  private

  # def assign_icon_num
  #   if current_user.icon_num.nil?
  #     rando = rand(1..4)
  #     current_user.update(icon_num: rando)
  #   else
  #     current_user.icon_num
  #   end
  # end
end
