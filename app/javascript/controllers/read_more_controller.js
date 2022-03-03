import { Application } from "@hotwired/stimulus"
import ReadMore from "stimulus-read-more"

const application = Application.start()
application.register("read-more", ReadMore)
