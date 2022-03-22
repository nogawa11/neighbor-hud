require 'rails_helper'

RSpec.describe Comment, type: :model do
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
  let(:comment) { Comment.new(content: "content", incident: incident, user: user)}

  describe '#initialize' do
    context 'when valid' do
      it 'generates a valid incident with all columns' do
        expect(incident.valid?).to eq(true)
      end
    end

    context 'when invalid' do
      context 'without content' do
        before do
          comment.content = nil
        end

        it 'generates an invalid comment' do
          expect(comment.valid?).to eq(false)
        end

        it 'generates an error message' do
          comment.valid?
          expect(comment.errors.messages).to eq({ content: ["can't be blank"] })
        end
      end
    end
  end
end
