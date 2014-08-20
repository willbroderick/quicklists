class CreateLists < ActiveRecord::Migration
  def change
    create_table :lists do |t|
      t.string :name
      t.integer :priority
      t.string :tint
      t.integer :user_id
      t.boolean :is_public
      t.boolean :is_contracted
      t.string :tags

      t.timestamps
    end
  end
end
