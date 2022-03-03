class FeedController < ApplicationController
  def index
    if params[:query].present?
      @incidents = policy_scope(Incident).near(params[:query])
    else
      all_incidents
    end
    params[:start_date].present? ? date_filter(params[:start_date], params[:end_date]) : all_incidents
    params[:filter].present? ? news_user_filter(params[:filter]) : all_incidents
    params[:category].present? ? category_filter(params[:category]) : all_incidents
  end

  private

  def news_user_filter(filter)
    @incidents = policy_scope(Incident).where('user_id IS NULL') if filter == "crimenews"
    @incidents = policy_scope(Incident).where('user_id IS NOT NULL') if filter == "userreports"
  end

  def date_filter(start_d, end_d)
    @start_date = Date.parse(start_d)
    @end_date = Date.parse(end_d)
    @all_incidents = policy_scope(Incident)
    @incidents = @all_incidents.where("incident_date >= ? AND incident_date <= ?", @start_date, @end_date)
  end

  def category_filter(category)
    if category == "disturbing"
      @incidents = policy_scope(Incident).tagged_with('Disturbing the Peace')
    else
      @incidents = policy_scope(Incident).tagged_with(category.capitalize)
    end
  end

  def all_incidents
    @incidents = policy_scope(Incident)
  end
end
