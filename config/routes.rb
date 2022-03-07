Rails.application.routes.draw do
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html

  devise_for :users
  root to: 'pages#home'

  get '/route', to: 'route#show', as: 'route'
  get '/feed', to: 'feed#index', as: 'feed'
  get '/profile', to: 'profile#show', as: 'profile'

  resources :incidents

  resources :incidents do
    resources :comments do
      resources :comments
    end
  end

  resources :comments, only: :destroy

  # Sidekiq Web UI, only for admins.
  require "sidekiq/web"
  authenticate :user, ->(user) { user.admin? } do
    mount Sidekiq::Web => '/sidekiq'
  end
end
