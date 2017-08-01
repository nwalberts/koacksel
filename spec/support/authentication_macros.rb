require 'active_support/concern'

module AuthenticationMacros
  extend ActiveSupport::Concern
  def sign_in_as(user)
    visit new_user_session_path
    fill_out_sign_in(user)
  end

  # def fill_out_sign_in(user)
  #   identity = user.identities[0]
  #
  #   fill_in 'Your Email or Username', with: identity.identifier
  #   fill_in 'Password', with: identity.password
  #   click_button 'Sign In'
  # end

  def sign_out
    click_link 'Sign Out'
  end

  def sign_up_as(set_expectations = true)
    visit new_registration_path
    register_user(set_expectations)
  end

  def register_user(set_expectations = true)
    fill_in 'Your Email', with: 'user@example.com'
    fill_in 'Pick a username', with: 'jsmith'

    fill_in 'First Name', with: 'John'
    fill_in 'Last Name', with: 'Smith'
    fill_in 'Enter a Password', with: 'password'
    fill_in 'Confirm Your Password', with: 'password'

    click_button 'Sign Up'


    if set_expectations
      expect(page).to have_content('Welcome!')
      expect(page).to have_content('Sign Out')
    end
  end

  # def expect_access_denied
  #   expect(page).to have_content('Access Denied.')
  # end
  #
  # def expect_sign_in_required
  #   expect(page).to have_content('Please sign in')
  # end

  # module ClassMethods
  #   def require_admin_user(&block)
  #     it 'requires authentication' do
  #       instance_eval(&block)
  #       expect_sign_in_required
  #     end
  #
  #     it 'requires an admin' do
  #       sign_in_as(FactoryGirl.create(:classic_user))
  #       instance_eval(&block)
  #       expect_access_denied
  #     end
  #   end
  # end
end
