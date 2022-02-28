class Location < ApplicationRecord
  belongs_to :user
  validates :address, presence: true
  validates :name, presence: true
end
