class IncidentsController < ApplicationController
  before_action :set_incident, only: [:show, :destroy]

  def index
    @incident = policy_scope(Incident)
  end

  def new
    @incident = Incident.new
    authorize @incident
  end

  def create
    @incident = Incident.new(incident_params)
    authorize @incident
    @incident.user = current_user
    @incident.can_receive_comments = true if @incident.can_receive_comments.nil?
    if @incident.save
      redirect_to incidents_path
    else
      render :new
    end
  end

  def show
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
    params.require(:incident).permit(:id, :title, :description, :incident_date, :location, :latitude, :longitude, :user_id)
  end
end
