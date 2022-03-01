class ScrapeJob < ApplicationJob
  queue_as :default

  def perform
    ScrapeJapantodayService.scrape_japantoday
  end
end
