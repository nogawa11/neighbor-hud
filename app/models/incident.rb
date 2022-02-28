class Incident < ApplicationRecord
  belongs_to :user, optional: true
  has_many :comments
  validates :title, presence: true
  validates :location, presence: true
  validates :incident_date, presence: true
end
