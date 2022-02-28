# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

puts "Removing Old Users, Incidents..."
Incident.destroy_all

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
  can_receive_comments: Faker::Boolean.boolean,
  user: user
)
incident_1.save!

incident_2 = Incident.new(
  title: "I was attacked by a homeless man.",
  description: Faker::Lorem.paragraph(sentence_count: 3),
  date: Faker::Date.forward(days: rand(1..30)),
  location: "Kamiyama-cho, Shibuya, Tokyo, Japan",
  latitude: "35.66443563179996",
  longitude: "139.69044280054845",
  can_receive_comments: Faker::Boolean.boolean,
  user: user
)
incident_2.save!

incident_3 = Incident.new(
  title: "My shoe got stolen!",
  description: Faker::Lorem.paragraph(sentence_count: 3),
  incident_date: Faker::Date.forward(days: rand(1..30)),
  location: "Nishi-araisakae-cho, Adachi, Tokyo, Japan",
  latitude: 35.774569,
  longitude: 139.791914,
  can_receive_comments: Faker::Boolean.boolean,
  user: user
)
incident_3.save!

incident_4 = Incident.new(
  title: "I was stabbed in the back..",
  description: Faker::Lorem.paragraph(sentence_count: 3),
  incident_date: Faker::Date.forward(days: rand(1..30)),
  location: "Petoskey-Otsego, Detroit, MI, USA",
  latitude: Faker::Address.latitude,
  longitude: Faker::Address.longitude,
  can_receive_comments: Faker::Boolean.boolean,
  user: user
)
incident_4.save!

incident_5 = Incident.new(
  title: "I saw a suspicious man rushing at me!",
  description: Faker::Lorem.paragraph(sentence_count: 3),
  incident_date: Faker::Date.forward(days: rand(1..30)),
  location:"Ferry Park Ave, Detroit, MI, USA",
  latitude: 42.35871933091293,
  longitude: -83.10033841230707,
  can_receive_comments: Faker::Boolean.boolean,
  user: user
)
incident_5.save!

puts "#{Incident.count} Incidents created"
