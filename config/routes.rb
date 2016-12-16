Rails.application.routes.draw do
  root 'main#index'

  resources :users, only: [:create, :destroy]
  # resources :sessions, only: [:create, :destroy]

  get '/sessions/create', to: 'sessions#create', as: 'sessions_create'
  get '/sessions/destroy', to: 'sessions#destroy', as: 'sessions_destroy'

  # Serve WebSocket cable requests in-process
  mount ActionCable.server => '/cable'

  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
