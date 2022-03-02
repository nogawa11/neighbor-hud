class CommentsController < ApplicationController
  skip_before_action :authenticate_user!, only: [ :index, :show ]

  def index
    @comments = policy_scope(Comment).where
  end

  def new
    @comment = Comment.new
    authorize @comment
    @incident = Incident.find(params[:incident_id]) if params[:incident_id].present?
    @original_comment = Comment.find(params[:comment_id]) if params[:comment_id].present?
  end

  def create
    @comment = Comment.new(comment_params)
    authorize @comment
    @original_comment = Comment.find(params[:comment_id]) if params[:comment_id].present?
    @incident = Incident.find(params[:incident_id])
    @comment.user = current_user
    @comment.comment = @original_comment if @original_comment.present?
    @comment.incident = @incident
    if @comment.save && !@original_comment.present?
      redirect_to incident_path(@incident)
    elsif @comment.save && @original_comment.present?
      redirect_to incident_comment_path(@incident, @original_comment)
    else
      render :new
    end
  end

  def show
    @original_comment = Comment.find(params[:id])
    authorize @original_comment
    @incident = Incident.find(params[:incident_id])
    @comment = Comment.new
    authorize @comment
  end

  def destroy
    @comment = Comment.find(params[:id])
    authorize @comment
    @comment.destroy
    redirect_to incident_path(@comment.incident)
  end

  private

  def comment_params
    params.require(:comment).permit(:content, :comment_id, :incident_id)
  end
end
