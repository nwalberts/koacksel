require 'rails_helper'

feature 'visitor registers' do

  scenario 'specify valid information from root' do
    visit '/users/sign_up'
    # click_link 'Sign Up'

    fill_in 'Email', with: 'user@example.com'
    fill_in 'First name', with: 'John'
    fill_in 'Last name', with: 'Smith'
    fill_in 'Password', with: 'password'
    fill_in 'Password confirmation', with: 'password'

    click_button 'Sign up'

    expect(page).to have_content('TEST')
    # expect(page).to have_content('Sign Out')
  end

end
