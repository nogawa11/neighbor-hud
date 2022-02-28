class CreateLocations < ActiveRecord::Migration[6.1]
  def change
    create_table :locations do |t|
      t.references :user, null: false, foreign_key: true
      t.string :address
      t.string :name
      t.float :latitude
      t.float :longtitude

      t.timestamps
    end
  end
end
