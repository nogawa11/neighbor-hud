class Incident < ApplicationRecord
  belongs_to :user, optional: true
  has_many :comments
  validates :title, presence: true
  validates :location, presence: true
  validates :receive_comments, presence: true
end
