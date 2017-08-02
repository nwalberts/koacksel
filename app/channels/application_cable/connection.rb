module ApplicationCable
  class Connection < ActionCable::Connection::Base
    # Here you can add logic to control user authentication and authorization
    # keep in mind, you dont have access to current user, so you will have to somehow get it through cookies


    # identified_by :current_user
    #
    # def connect
    #   self.current_user = find_verified_user
    #   logger.add_tags 'ActionCable', current_user.name
    # end
    #
    # protected

    # def find_verified_user
    #   verified_user = User.find_by(id: cookies.signed['user.id'])
    #   if verified_user && cookies.signed['user.expires_at'] > Time.now
    #     verified_user
    #   else
    #     reject_unauthorized_connection
    #   end
    # end
  end
end
