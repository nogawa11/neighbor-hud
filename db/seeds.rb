# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)
puts "Destroying old Users..."
User.destroy_all
puts "Creating new Users..."

20.times do
  User.create(
    name: Faker::FunnyName.unique.name,
    email: Faker::Internet.unique.email,
    password: "password"
  )
end

puts "Destroying old comments..."
Comment.destroy_all
puts "Creating new comments..."

100.times do
  quote = rand(0..3)
  loc_quote = quote
  zero_or_one = rand(0..1)
  amount = ""


  case quote
  when 0
    Faker::TvShows::TwinPeaks.quote
  when 1
    Faker::Games::WarhammerFantasy.quote
  when 2
    Faker::Games::Overwatch.quote
  when 3
    Faker::Games::HeroesOfTheStorm.quote
  end

  case loc_quote
  when 0
    Faker::TvShows::TwinPeaks.location
  when 1
    Faker::Games::WarhammerFantasy.location
  when 2
    Faker::Games::Overwatch.location
  when 3
    Faker::Games::HeroesOfTheStorm.battleground
  end

  zero_or_one.zero? ? amount = "always" : amount = "never"

  Comment.create(
    content: "#{quote} This would #{amount} happen in #{loc_quote}. Complete #{Faker::Emotion.noun}.",
    user_id: User.all.sample,
    incident_id: Incident.all.sample
  )
end
