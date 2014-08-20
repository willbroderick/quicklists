Quicklists::Application.routes.draw do
  devise_for :users

  root 'list#index'

  get '/:handle' => 'list#index'

  post '/:handle/create' => 'list#create', :as => 'new_list'
  post '/:handle/update/:id' => 'list#update', :as => 'update_list'
end
