class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable
  has_many :lists
  before_validation :enforce_handle

  private
  def enforce_handle
    if handle.nil? or handle.blank?
      self.handle = 'default-'+rand(9999999999).to_s
    end
  end
end
