class IncidentsController < ApplicationController
  skip_before_action :authenticate_user!, only: [ :index, :show ]
  before_action :set_incident, only: [:show, :destroy]

  def index
    @incidents = policy_scope(Incident).includes(:comments)
    @markers = @incidents.geocoded.map do |incident|
      {
        lat: incident.latitude,
        lng: incident.longitude,
        id: incident.id,

      }
    end

    respond_to do |format|
      format.html
      format.text { render partial: "/shared/map.html.erb", locals: { markers: @markers } }
    end
  end

  def new
    @incident = Incident.new
    authorize @incident
    @markers = [
      { lat: 0, lng: 0 }
    ]
  end

  def create
    @incident = Incident.new(incident_params)
    authorize @incident
    @incident.user = current_user
    @incident.incident_date = params[:incident_date]
    if @incident.category_list.empty?
      @incident.category_list.add("Disturb")
    elsif @incident.category_list.first.include?("disturbing")
      @incident.category_list.remove("disturbing the peace")
      @incident.category_list.add("Disturb")
    end
    add_icon_image(@incident.category_list.first)
    @incident.image_path = @image_path
    if @incident.save
      redirect_to incident_path(@incident)
    else
      render :new
    end
  end

  def show
    @comment = Comment.new
    authorize @comment
    @incident = Incident.find(params[:incident_id]) if params[:incident_id].present?
    @original_comment = Comment.find(params[:comment_id]) if params[:comment_id].present?
    @marker = [{
      lat: @incident.latitude,
      lng: @incident.longitude,
      id: @incident.id,
      src: ActionController::Base.helpers.asset_path("#{@incident.image_path.downcase}")
    }]
  end

  def destroy
    @incident.destroy
    redirect_to profile_path
  end

  private

  def set_incident
    @incident = Incident.find(params[:id])
    authorize @incident
  end

  def incident_params
    params.require(:incident).permit(:id, :title, :description, :incident_date, :location, :latitude, :longitude, :user_id, :can_receive_comments, :category_list, :category, category_list: [])
  end

  def add_icon_image(category)
    @image_path = "#{category}.png"
  end

  def add_category(category)
    if category.include?("Disturbing")
      @category = "Disturb"
    else
      @category = category
    end
  end
end
