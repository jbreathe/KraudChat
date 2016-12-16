# Контроллер отвечает за CRUD операции над пользователями.
class UsersController < ApplicationController
  def create
    user = User.new(user_params)
    if user.save
      sign_in user
      redirect_back(fallback_location: root_path)
    end
  end

  def destroy

  end

  private
  def user_params
    params.require(:user).permit(:name, :password, :password_confirmation)
  end
end
