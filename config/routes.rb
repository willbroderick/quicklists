Quicklists::Application.routes.draw do
  get "user/update"
  devise_for :users

  root 'list#index'

  get '/all_users' => 'user#list', :as => 'user_list'

  get '/:handle' => 'list#index', :as => 'public_list'

  post '/:handle/create' => 'list#create', :as => 'new_list'
  post '/:handle/update/:id' => 'list#update', :as => 'update_list'

  patch '/update_user_handle/:id' => 'user#update_handle', :as => 'update_user_handle'
end
