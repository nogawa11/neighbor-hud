class FeedController < ApplicationController
  def index
    if params[:query].present?
      @incidents = policy_scope(Incident).near(params[:query])
    else
      @incidents = policy_scope(Incident)
    end
    if params[:start_date].present?
      @start_date = Date.parse(params[:start_date])
      @end_date = Date.parse(params[:end_date])
      @all_incidents = policy_scope(Incident)
      @incidents = @all_incidents.where("incident_date >= ? AND incident_date <= ?", @start_date, @end_date)
    else
      @incidents = policy_scope(Incident)
    end
    if params[:filter].present?
      @incidents = policy_scope(Incident).where('user_id IS NULL') if params[:filter] == "crimenews"
      @incidents = policy_scope(Incident).where('user_id IS NOT NULL') if params[:filter] == "userreports"
    else
      @incidents = policy_scope(Incident)
    end
  end
end
