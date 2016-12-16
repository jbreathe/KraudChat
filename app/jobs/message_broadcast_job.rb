class MessageBroadcastJob < ApplicationJob
  queue_as :default

  def perform(message)
    ActionCable.server.broadcast('messages_channel', message: render(message))
  end

  private
  def render(message)
    MainController.render(partial: 'messages/message_no_class', locals: {message: message})
  end
end
