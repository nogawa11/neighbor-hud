class ScrapeJob < ApplicationJob
  queue_as :default

  def perform
    ScrapeJapantodayService.scrape_japantoday
    ScrapeMainichinewsService.scrape_mainichinews
  end
end
