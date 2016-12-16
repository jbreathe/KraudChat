class User < ApplicationRecord
  has_secure_password
  has_many :messages
  has_many :conversations, foreign_key: 'sender_id', class_name: 'Conversation'
  has_many :recipients, through: :conversations

  before_create :create_remember_token

  def self.new_remember_token
    SecureRandom.urlsafe_base64
  end

  def self.encrypt(token)
    Digest::SHA1.hexdigest(token.to_s)
  end

  def update_remember_token(new_remember_token)
    self.update_attribute(:remember_token, new_remember_token)
  end

  private
  def create_remember_token
    self.remember_token = User.encrypt(User.new_remember_token)
  end
end
