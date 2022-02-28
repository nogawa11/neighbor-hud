class CommentsController < ApplicationController
  before_action :set_comment, only: [:show, :destroy]
  skip_before_action :authenticate_user!, only: [ :index, :show ]

  def index
    @comments = policy_scope(Comment).where
  end

  def new
    @comment = Comment.new
    authorize @comment
  end

  def create
    @comment = Comment.new(comment_params)
    authorize @comment
    @comment.user = current_user
    @comment.comment = Comment.find(params[:comment_id]) if Comment.find(params[:comment_id])
    @comment.incident = Incident.find(params[:incident_id]) if Incident.find(params[:incident_id])
    if @comment.save
      redirect_to incident_path(@incident)
    else
      render :new
    end
  end

  def show
  end

  def destroy
    @comment.destroy
    redirect_to incident_path(@comment.incident)
  end

  private

  def set_comment
    @comment = Comment.find(params[:id])
    authorize @comment
  end

  def comment_params
    params.require(:comment).permit(:content, :comment_id, :incident_id)
  end
end
