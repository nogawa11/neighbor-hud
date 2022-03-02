class FeedController < ApplicationController
  def index
    if params[:query].present?
      @incidents = policy_scope(Incident).near(params[:query])
    else
      @incidents = policy_scope(Incident)
    end
  end
end
