class Comment < ApplicationRecord
  belongs_to :user
  belongs_to :incident
  belongs_to :comment
  validates :content, presence: true
end
