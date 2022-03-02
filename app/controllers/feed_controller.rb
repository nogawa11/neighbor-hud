class FeedController < ApplicationController
  def index
    @incidents = policy_scope(Incident)
  end
end
