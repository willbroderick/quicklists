class AddParsedFlagToLists < ActiveRecord::Migration
  def change
    change_table :lists do |t|
      t.boolean :is_in_parsed_mode
    end
  end
end
