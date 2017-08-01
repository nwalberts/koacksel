require 'factory_girl'

FactoryGirl.define do
  factory :user do
    sequence(:email) { |n| "user#{n}@example.com" }
    sequence(:username) { |n| "user#{n}" }
    sequence(:first_name) { |n| "John#{n}" }
    sequence(:last_name) { |n| "Appleseed#{n}" }
  end
end
