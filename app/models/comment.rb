class Comment < ApplicationRecord
  belongs_to :user
  belongs_to :incident
  has_many :comments
  belongs_to :comment, optional: true
  validates :content, presence: true
end
