require "open-uri"
require "nokogiri"

class ScrapeMainichinewsService < ApplicationRecord
  THEFT = ["stolen", "stole", "theft", "robbery", "robbed", "steals", "robbing", "stealing"]
  ARSON = ["burn", "fire", "burned", "arson"]
  HARASSMENT = ["sexual assault", "grope", "groped", "groping", "sexual abuse", "harassed", "harass", "harassment", "exposing", "indecent", "raped", "sexual", "naked", "voyeurism"]
  TRAFFIC = ["motorcyclist", "crash", "red light", "car accident"]
  DRUGS = ["stimulants", "weed", "marijuana", "cocaine", "heroine", "methamphetamine", "methamphetamines", "drugs"]
  VIOLENCE = ["violent", "hit", "kill", "murder", "stabbed", "knife", "killed", "punched", "kicked", "killing", "attacked", "abuse", "assaulting", "dead", "stabbing", "attacks", "shoot", "shoots", "shot", "assault", "gun", "knife"]

  def self.scrape_mainichinews
    base_url = "https://mainichi.jp/english/japan/crime-accidents/"
    html_file = URI.open(base_url).read
    html_doc = Nokogiri::HTML(html_file)
    @urls = []
    html_doc.search('.newslist').css('li').each do |li|
      url = "https:#{li.css('a').attribute('href').value}"
      if url != "https:" && url.include?("https://mainichi.jp/english/articles/")
        @urls << url
      end
    end
    @urls.each do |url|
      file = URI.open(url).read
      doc = Nokogiri::HTML(file)
      @article = {}
      @article[:title] = doc.css('h1').text
      if !Incident.where(title: @article[:title]).present?
        @article[:incident_date] = DateTime.parse(doc.search('.post').css('time').text).to_date
        @article[:location] = doc.search('.main-text').css('p').text.split.first
        @article[:description] = doc.search('.main-text').css('p').text
        @incident = Incident.new(@article)
        keywords = []
        keywords << "Theft" if THEFT.any? { |keyword| @article[:description].downcase.include? keyword }
        keywords << "Arson" if ARSON.any? { |keyword| @article[:description].downcase.include? keyword }
        keywords << "Harassment" if HARASSMENT.any? { |keyword| @article[:description].downcase.include? keyword }
        keywords << "Traffic" if TRAFFIC.any? { |keyword| @article[:description].downcase.include? keyword }
        keywords << "Drugs" if DRUGS.any? { |keyword| @article[:description].downcase.include? keyword }
        keywords << "Violence" if VIOLENCE.any? { |keyword| @article[:description].downcase.include? keyword }
        keywords << "Disturbing the Peace" if keywords.empty?
        keywords.each do |keyword|
          @incident.category_list.add(keyword)
        end
        @incident.save
      end
    end
  end
end
