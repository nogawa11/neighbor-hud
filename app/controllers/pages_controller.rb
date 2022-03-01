class PagesController < ApplicationController
  skip_before_action :authenticate_user!, only: [:home]
  def home
    # Had to add the following instances otherwise the map wouldn't work.
    @incidents = policy_scope(Incident)
    @markers = @incidents.geocoded.map do |incident|
      {
        lat: incident.latitude,
        lng: incident.longitude,
        id: incident.id
      }
    end
  end
end
