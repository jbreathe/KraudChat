class SessionsController < ApplicationController
  def create
    session_hash = params[:session]
    user = User.find_by_name(session_hash[:name])
    if user && user.authenticate(session_hash[:password])
      sign_in user
      redirect_back(fallback_location: root_path)
    end
  end

  def destroy
    sign_out
    redirect_back(fallback_location: root_path)
  end
end
