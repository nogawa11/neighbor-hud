class Comment < ApplicationRecord
  belongs_to :user
  belongs_to :incident
  belongs_to :comment, optional: true
  has_many :comments
  validates :content, presence: true
end
