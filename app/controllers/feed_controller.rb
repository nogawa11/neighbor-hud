class FeedController < ApplicationController
  skip_before_action :authenticate_user!, only: [:index, :show]

  def index
    @incidents = policy_scope(Incident).order(incident_date: :desc)
    @incidents = location_filter(@incidents, params[:query]) if params[:query].present?
    @incidents = location_filter(@incidents, params[:location]) if params[:location].present?
    @incidents = category_filter(@incidents, params[:category]) if params[:category].present?
    @incidents = news_user_filter(@incidents, params[:filter]) if params[:filter].present?
    @incidents = date_filter(@incidents, params[:start_date], params[:end_date]) if params[:start_date].present?

    respond_to do |format|
      format.html
      format.text { render partial: "/feed/feed_incidents.html.erb", locals: { incidents: @incidents } }
    end
  end

  private

  def location_filter(incidents, location)
    incidents.near(location).order(incident_date: :desc).includes(:comments)
  end

  def news_user_filter(incidents, filter)
    if filter == "newsreports"
      incidents.where('user_id IS NULL').order(incident_date: :desc).includes(:comments)
    elsif filter == "userreports"
      incidents.where('user_id IS NOT NULL').order(incident_date: :desc).includes(:comments)
    elsif filter == "all"
      incidents
    end
  end

  def date_filter(incidents, start_d, end_d)
    @start_date = Date.parse(start_d)
    @end_date = Date.parse(end_d)
    incidents.where("incident_date >= ? AND incident_date <= ?", @start_date, @end_date).order(incident_date: :desc).includes(:comments)
  end

  def category_filter(incidents, category)
    if category.downcase.include?("disturb")
      incidents.tagged_with('Disturb').order(incident_date: :desc).includes(:comments)
    else
      incidents.tagged_with(category.capitalize).order(incident_date: :desc).includes(:comments)
    end
  end
end
