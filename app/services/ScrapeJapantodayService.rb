require "open-uri"
require "nokogiri"

class ScrapeJapantodayService < ApplicationRecord
  THEFT = ["stolen", "stole", "theft", "robbery", "robbed", "steals", "robbing", "stealing"]
  ARSON = ["burn", "fire", "burned", "arson"]
  HARASSMENT = ["sexual assault", "grope", "groped", "groping", "sexual abuse", "harassed", "harass", "harassment", "exposing", "indecent", "raped", "sexual", "naked", "voyeurism"]
  TRAFFIC = ["motorcyclist", "crash", "red light", "car accident"]
  DRUGS = ["stimulants", "weed", "marijuana", "cocaine", "heroine", "methamphetamine", "methamphetamines", "drugs"]
  VIOLENCE = ["violent", "hit", "kill", "murder", "stabbed", "knife", "killed", "punched", "kicked", "killing", "attacked", "abuse", "assaulting", "dead", "stabbing", "attacks", "shoot", "shoots", "shot", "assault", "gun", "knife"]

  def self.scrape_japantoday
    base_url = "https://japantoday.com/category/crime"
    html_file = URI.open(base_url).read
    html_doc = Nokogiri::HTML(html_file)
    @urls = []
    html_doc.search(".media-heading").each do |element|
      url = "https://japantoday.com#{element.css('a').attribute('href')}"
      @urls << url unless url == "https://japantoday.com"
    end
    @urls.each do |url|
      file = URI.open(url).read
      doc = Nokogiri::HTML(file)
      @article = {}
      @article[:title] = doc.css('h1').text
      if !Incident.where(title: @article[:title]).present?
        @article[:location] = doc.search('.dateline').text
        @article[:incident_date] = doc.css('time').attribute('datetime').value
        @article[:description] = doc.at("[@itemprop = 'articleBody']").text
        @incident = Incident.new(@article)
        keywords = []
        keywords << "Theft" if THEFT.any? { |keyword| @article[:description].downcase.include? keyword }
        keywords << "Arson" if ARSON.any? { |keyword| @article[:description].downcase.include? keyword }
        keywords << "Harrasment" if HARASSMENT.any? { |keyword| @article[:description].downcase.include? keyword }
        keywords << "Traffic" if TRAFFIC.any? { |keyword| @article[:description].downcase.include? keyword }
        keywords << "Drugs" if DRUGS.any? { |keyword| @article[:description].downcase.include? keyword }
        keywords << "Violence" if VIOLENCE.any? { |keyword| @article[:description].downcase.include? keyword }
        keywords << "Disturbing the Peace" if keywords.empty?
        keywords.each do |keyword|
          @incident.category_list.add(keyword)
        end
        if @incident.category_list.first == 'Disturbing the Peace'
          @incident.image_path = 'disturb.png'
        else
          @incident.image_path = "#{@incident.category_list.first}.png"
        end
        @incident.save
      end
    end
  end
end
