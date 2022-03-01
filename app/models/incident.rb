class Incident < ApplicationRecord
  belongs_to :user, optional: true
  has_many :comments
  validates :title, presence: true
  validates :location, presence: true
  validates :incident_date, presence: true
  after_validation :geocode, if: :will_save_change_to_location?
  geocoded_by :location
  acts_as_taggable_on :categories
end
