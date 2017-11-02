class Api::V1::UsersController < ApplicationController
  def index
    render json: { user_id: current_user.id, handle: current_user.handle, icon_num: current_user.icon_num }
  end
  # render json: { user_id: current_user.id, handle: current_user.handle, icon_num: current_user.icon_num }


  # def destroy
  #   @user = User.find(params[:id])
  #   @user.destroy
  #   flash[:notice] = "Successfully deleted user!"
  #   redirect_to users_path
  # end
  #
  # def make_admin
  #   @user = User.find(params[:id])
  #   @user.update_attribute :role, "admin"
  #   flash[:notice] = "Successfully made user admin!"
  #   redirect_to users_path
  # end
end
