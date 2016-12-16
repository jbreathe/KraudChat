module ApplicationCable
  class Connection < ActionCable::Connection::Base
    identified_by :current_user

    def connect
      self.current_user = find_current_user
    end

    private
    def find_current_user
      remember_token = User.encrypt(cookies[:remember_token])
      current_user = User.find_by(remember_token: remember_token)
      if current_user
        current_user
      else
        reject_unauthorized_connection
      end
    end
  end
end
