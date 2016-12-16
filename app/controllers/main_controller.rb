# Главный контроллер приложения. Метод index отвечает на запросы к root url.
class MainController < ApplicationController
  def index
    @messages = Message.all.reverse
  end
end
