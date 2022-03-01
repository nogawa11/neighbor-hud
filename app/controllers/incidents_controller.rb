class IncidentsController < ApplicationController
  skip_before_action :authenticate_user!, only: [ :index, :show ]
  before_action :set_incident, only: [:show, :destroy]

  def index
    @incidents = policy_scope(Incident)
    @markers = @incidents.geocoded.map do |incident|
      {
        lat: incident.latitude,
        lng: incident.longitude
      }
    end
  end

  def new
    @incident = Incident.new
    authorize @incident
  end

  def create
    @incident = Incident.new(incident_params)
    authorize @incident
    @incident.user = current_user
    if @incident.save
      redirect_to incidents_path
    else
      render :new
    end
  end

  def show
    @comment = Comment.new
    authorize @comment
    @incident = Incident.find(params[:incident_id]) if params[:incident_id].present?
    @original_comment = Comment.find(params[:comment_id]) if params[:comment_id].present?
  end

  def destroy
    @incident.destroy
    redirect_to incidents_path
  end

  private

  def set_incident
    @incident = Incident.find(params[:id])
    authorize @incident
  end

  def incident_params
    params.require(:incident).permit(:id, :title, :description, :incident_date, :location, :latitude, :longitude, :user_id, :can_receive_comments, category_list: [])
  end
end
