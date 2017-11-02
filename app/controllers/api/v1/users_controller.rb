class Api::V1::UsersController < ApplicationController
  def index
    render json: { user_id: current_user.id, handle: current_user.handle, icon_num: current_user.icon_num }
  end
end
