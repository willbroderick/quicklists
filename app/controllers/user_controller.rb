class UserController < ApplicationController
  def update_handle
    authenticate_user!
    if params.require(:id).to_s == current_user.id.to_s
      current_user.handle = params.require(:user).require(:handle)
      current_user.save
      redirect_to '/'
    else
      abort 'incorrect params!'
    end
  end

  def list
    @users = User.all
  end
end
