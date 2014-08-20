class CreateItems < ActiveRecord::Migration
  def change
    create_table :items do |t|
      t.text :text
      t.integer :priority
      t.string :highlight
      t.integer :list_id

      t.timestamps
    end
  end
end
