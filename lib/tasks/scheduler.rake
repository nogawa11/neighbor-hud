desc "This task is called by the Heroku scheduler add-on"
task :scrape_job => :environment do
  puts "scraping sites"
  ScrapeJob.perform_now
  puts "done."
end
