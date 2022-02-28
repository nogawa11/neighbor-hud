class CreateIncidents < ActiveRecord::Migration[6.1]
  def change
    create_table :incidents do |t|
      t.string :title
      t.string :description
      t.date :incident_date
      t.string :location
      t.float :latitude
      t.float :longitude
      t.references :user, null: false, foreign_key: true
      t.boolean :can_receive_comments

      t.timestamps
    end
  end
end
