class AddUrlToIncidents < ActiveRecord::Migration[6.1]
  def change
    add_column :incidents, :url, :string
  end
end
