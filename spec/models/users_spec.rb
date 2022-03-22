require 'rails_helper'

RSpec.describe User, type: :model do
  let(:user) { User.new(name: 'name', email: 'email@gmail.com', password: 'password') }

  describe '#initialize' do
    context 'when valid' do
      it 'generates a valid user with all columns' do
        expect(user.valid?).to eq(true)
      end
    end

    context 'when invalid' do
      context 'without name' do
        before do
          user.name = nil
        end

        it 'generates an invalid user' do
          expect(user.valid?).to eq(false)
        end

        it 'generates an error message' do
          user.valid?
          expect(user.errors.messages).to eq({ name: ["can't be blank"] })
        end
      end
    end
  end
end
