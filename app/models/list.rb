class List < ActiveRecord::Base
  has_many :items
  belongs_to :user
  default_scope { order('priority desc') }
end
