class CommentsController < ApplicationController
  skip_before_action :authenticate_user!, only: [ :index, :show ]

  def index
    @comments = policy_scope(Comment).where
  end

  def new
    find_incident(params[:incident_id]) if params[:incident_id].present?
    find_original_comment(params[:comment_id]) if params[:comment_id].present?
    @comment = Comment.new
    authorize @comment
  end

  def create
    find_incident(params[:incident_id])
    find_original_comment(params[:comment_id]) if params[:comment_id].present?
    @comment = Comment.new(comment_params)
    authorize @comment
    @comment.user = current_user
    @comment.comment = @original_comment if @original_comment.present?
    @comment.incident = @incident
    redirect(@comment, @original_comment, @incident)
  end

  def show
    find_incident(params[:incident_id])
    find_original_comment(params[:id])
    @comment = Comment.new
    authorize @comment
  end

  def destroy
    find_comment(params[:id])
    @comment.destroy
    redirect_to incident_path(@comment.incident)
  end

  private

  def comment_params
    params.require(:comment).permit(:content, :comment_id, :incident_id)
  end

  def find_original_comment(comment_id)
    @original_comment = Comment.find(comment_id)
    authorize @original_comment
  end

  def find_comment(comment_id)
    @comment = Comment.find(comment_id)
    authorize @comment
  end

  def find_incident(incident_id)
    @incident = Incident.find(incident_id)
  end

  def redirect(comment, original_comment, incident)
    if comment.save && !original_comment.present?
      redirect_to incident_path(incident)
    elsif comment.save && original_comment.present?
      redirect_to incident_comment_path(incident, original_comment)
    else
      render :new
    end
  end
end
