class RouteController < ApplicationController
  skip_after_action :verify_authorized, only: [:show]

  def show
    @incidents = policy_scope(Incident)
    @markers = @incidents.geocoded.map do |incident|
      {
        lat: incident.latitude,
        lng: incident.longitude,
        id: incident.id,
        src: ActionController::Base.helpers.asset_path(incident.image_path.downcase.to_s),
        user: incident.user
      }
    end
  end
end
