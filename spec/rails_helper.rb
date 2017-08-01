ENV['RAILS_ENV'] ||= 'test'
require File.expand_path('../../config/environment', __FILE__)
abort("The Rails environment is running in production mode!") if Rails.env.production?
require 'spec_helper'
require 'rspec/rails'
require 'devise'
require 'factory_girl'
require 'database_cleaner'
require 'shoulda-matchers'


ActiveRecord::Migration.maintain_test_schema!

RSpec.configure do |config|
  config.fixture_path = "#{::Rails.root}/spec/fixtures"


  config.use_transactional_fixtures = true

  # config.include AuthenticationMacros
  # config.include ControllerHelpers::Authentication, type: :controller
  # config.include FactoryGirl::Syntax::Methods

  config.infer_spec_type_from_file_location!


  config.filter_rails_from_backtrace!

end
require "capybara/rails"
require "valid_attribute"

RSpec.configure do |config|
 config.include Warden::Test::Helpers
 config.include Devise::Test::IntegrationHelpers, type: :feature
 config.include Devise::Test::ControllerHelpers, type: :controller

 config.before :each do
   ActionMailer::Base.deliveries.clear
 end
  config.include FactoryGirl::Syntax::Methods
end
