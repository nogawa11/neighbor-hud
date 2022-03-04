class AddImageToIncident < ActiveRecord::Migration[6.1]
  def change
    add_column :incidents, :image_path, :string
  end
end
