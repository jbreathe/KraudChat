# Be sure to restart your server when you modify this file. Action Cable runs in a loop that does not support auto reloading.
class MessagesChannel < ApplicationCable::Channel
  def subscribed
    stream_from 'messages_channel'
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end

  def speak(data)
    message_content = data['message']
    sender_id = current_user.id
    message = Message.new(content: message_content, user_id: sender_id)
    message.save
    recipients_names = message_content.scan(/@\w+/).map { |word| word.tr('@', '') }
    unless recipients_names.empty?
      recipients_names.each do |recipient_name|
        if recipient_name == current_user.name
          next
        end
        recipient = User.find_by_name(recipient_name)
        if recipient
          recipient_id = recipient.id
          conversation = Conversation.find_by(sender_id: sender_id, recipient_id: recipient_id)
          unless conversation
            conversation = Conversation.new(sender_id: sender_id, recipient_id: recipient_id)
          end
          conversation.messages << message
          conversation.save
        end
      end
    end
  end
end
