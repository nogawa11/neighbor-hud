class PagesController < ApplicationController
  skip_before_action :authenticate_user!, only: [:home]

  def home
    if params[:filter] == "all"
      all_incidents
    elsif params[:filter].present?
      news_user_filter(params[:filter])
    elsif params[:start_date].present?
      date_filter(params[:start_date], params[:end_date])
    elsif params[:category].present?
      category_filter(params[:category])
    else
      all_incidents
    end
    @markers = @incidents.geocoded.map do |incident|
      {
        lat: incident.latitude,
        lng: incident.longitude,
        id: incident.id,
        src: ActionController::Base.helpers.asset_path("#{incident.image_path.downcase}")
      }
    end

    respond_to do |format|
      format.html
      format.text { render partial: "/shared/map.html.erb", locals: { markers: @markers } }
    end
  end

  private

  def news_user_filter(filter)
    @incidents = policy_scope(Incident).where('user_id IS NULL').includes(:comments) if filter == "newsreports"
    @incidents = policy_scope(Incident).where('user_id IS NOT NULL').includes(:comments) if filter == "userreports"
  end

  def date_filter(start_d, end_d)
    @start_date = Date.parse(start_d)
    @end_date = Date.parse(end_d)
    @all_incidents = policy_scope(Incident)
    @incidents = @all_incidents.where("incident_date >= ? AND incident_date <= ?", @start_date, @end_date).includes(:comments)
  end

  def category_filter(category)
    if category.downcase.include?("disturb")
      @incidents = policy_scope(Incident).tagged_with("Disturb").includes(:comments)
    else
      @incidents = policy_scope(Incident).tagged_with(category.capitalize).includes(:comments)
    end
  end

  def all_incidents
    @incidents = policy_scope(Incident).includes(:comments)
  end
end
