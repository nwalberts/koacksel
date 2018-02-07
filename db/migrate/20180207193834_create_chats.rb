class CreateChats < ActiveRecord::Migration[5.1]
  def change
    create_table :chats do |t|
      t.string :title
      t.string :description

      t.timestamps
    end
  end
end
