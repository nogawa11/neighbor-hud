class AddSourceToIncidents < ActiveRecord::Migration[6.1]
  def change
    add_column :incidents, :source, :string
  end
end
