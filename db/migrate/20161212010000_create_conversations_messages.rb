class CreateConversationsMessages < ActiveRecord::Migration[5.0]
  def change
    create_table :conversations_messages do |t|
      t.integer :conversation_id, null: false, index: true
      t.integer :message_id, null: false, index: true
    end
  end
end
