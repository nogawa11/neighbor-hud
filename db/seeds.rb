# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).

puts "Removing Old Users, Incidents, Comments..."
User.destroy_all
Incident.destroy_all
Comment.destroy_all

puts "Creating New Users..."

user = User.new(
  name: "lewagon",
  email: "lewagon@gmail.com",
  password: "123123"
)
user.save!

puts "Creating New Incidents..."

incident_1 = Incident.new(
  title: "My wallet got stolen!",
  description: Faker::Lorem.paragraph(sentence_count: 3),
  incident_date: Faker::Date.forward(days: rand(1..30)),
  location:"YuKabuki-cho, Shinjuku, Tokyo, Japan",
  latitude: 35.695379,
  longitude: 139.702881,
  can_receive_comments: true,
  user: user,
  image_path: "Theft.png"
)
incident_1.save!

incident_2 = Incident.new(
  title: "I was attacked by someone's dog.",
  description: Faker::Lorem.paragraph(sentence_count: 3),
  incident_date: Faker::Date.forward(days: rand(1..30)),
  location: "Kamiyama-cho, Shibuya, Tokyo, Japan",
  latitude: "35.66443563179996",
  longitude: "139.69044280054845",
  can_receive_comments: false,
  user: user,
  image_path: "Violence.png"
)
incident_2.save!

incident_3 = Incident.new(
  title: "My shoe got stolen!",
  description: Faker::Lorem.paragraph(sentence_count: 3),
  incident_date: Faker::Date.forward(days: rand(1..30)),
  location: "Nishi-araisakae-cho, Adachi, Tokyo, Japan",
  latitude: 35.774569,
  longitude: 139.791914,
  can_receive_comments: true,
  user: user,
  image_path: "Theft.png"
)
incident_3.save!

incident_4 = Incident.new(
  title: "I was stabbed in the back..",
  description: Faker::Lorem.paragraph(sentence_count: 3),
  incident_date: Faker::Date.forward(days: rand(1..30)),
  location: "Petoskey-Otsego, Detroit, MI, USA",
  latitude: Faker::Address.latitude,
  longitude: Faker::Address.longitude,
  can_receive_comments: true,
  user: user,
  image_path: "Violence.png"
)
incident_4.save!

incident_5 = Incident.new(
  title: "I saw a suspicious man rushing at me!",
  description: Faker::Lorem.paragraph(sentence_count: 3),
  incident_date: Faker::Date.forward(days: rand(1..30)),
  location:"Ferry Park Ave, Detroit, MI, USA",
  latitude: 42.35871933091293,
  longitude: -83.10033841230707,
  can_receive_comments: false,
  user: user,
  image_path: "Disturb.png"
)
incident_5.save!

puts "Creating new comments..."

5.times do
  3.times do |i|
    incident_array = Incident.all
    quote_num = rand(0..3)
    amount = ""

    case quote_num
    when 0
      quote = Faker::TvShows::TwinPeaks.quote
    when 1
      quote = Faker::Games::WarhammerFantasy.quote
    when 2
      quote = Faker::Games::Overwatch.quote
    when 3
      quote = Faker::Games::HeroesOfTheStorm.quote
    end

    case quote_num
    when 0
      loc_quote = Faker::TvShows::TwinPeaks.location
    when 1
      loc_quote = Faker::Games::WarhammerFantasy.location
    when 2
      loc_quote = Faker::Games::Overwatch.location
    when 3
      loc_quote = Faker::Games::HeroesOfTheStorm.battleground
    end

    case i
    when 0
      incident_obj = incident_array[0]
    when 1
      incident_obj = incident_array[2]
    when 2
      incident_obj = incident_array[3]
    end

    rand(0..1).zero? ? amount = "always" : amount = "never"

    @comment = Comment.create!(
      content: "#{quote} This would #{amount} happen in #{loc_quote}. Complete #{Faker::Emotion.noun}.",
      user: User.all.sample,
      incident: incident_obj
    )
  end
end

puts "#{User.count} User created"
puts "#{Incident.count} Incidents created"
puts "#{Comment.count} comments created"
