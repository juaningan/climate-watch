class CreateVisualization < ActiveRecord::Migration[5.1]
  def change
    create_table :visualizations do |t|
      t.string :title
      t.text :description
      t.jsonb :json_body
      t.timestamps
      t.integer :user_id

      t.foreign_key :users
    end
  end
end
