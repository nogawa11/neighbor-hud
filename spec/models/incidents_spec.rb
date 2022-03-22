require 'rails_helper'

RSpec.describe User, type: :model do
  let(:user) { User.new(name: 'name', email: 'email@gmail.com', password: 'password') }
  let(:incident) {Incident.new(
    title: "Title",
    description: "Desciption",
    incident_date: Date.today,
    location:"YuKabuki-cho, Shinjuku, Tokyo, Japan",
    latitude: 35.695379,
    longitude: 139.702881,
    can_receive_comments: true,
    user: user,
    image_path: "Theft.png",
    category_list: ["Theft"]
  )}

  describe '#initialize' do
    context 'when valid' do
      it 'generates a valid incident with all columns' do
        expect(incident.valid?).to eq(true)
      end
    end

    context 'when invalid' do
      context 'without title' do
        before do
          incident.title = nil
        end

        it 'generates an invalid incident' do
          expect(incident.valid?).to eq(false)
        end

        it 'generates an error message' do
          incident.valid?
          expect(incident.errors.messages).to eq({ title: ["can't be blank"] })
        end
      end
    end

    context 'when invalid' do
      context 'without incident date' do
        before do
          incident.incident_date = nil
        end

        it 'generates an invalid incident' do
          expect(incident.valid?).to eq(false)
        end

        it 'generates an error message' do
          incident.valid?
          expect(incident.errors.messages).to eq({ incident_date: ["can't be blank"] })
        end
      end
    end

    context 'when invalid' do
      context 'without location' do
        before do
          incident.location = nil
        end

        it 'generates an invalid incident' do
          expect(incident.valid?).to eq(false)
        end

        it 'generates an error message' do
          incident.valid?
          expect(incident.errors.messages).to eq({ location: ["can't be blank"] })
        end
      end
    end
  end
end
