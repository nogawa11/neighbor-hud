# NeighborHUD

A crime tracking and mapping app where users can see what incidents are happening in their area. Users can read crime news from well-known English news sources in Japan and self-report their own incidents. The app also has a directions feature that allows users to find the safest route to a given destination, avoiding any reported incidents along the way.

![Screen Shot 2022-03-14 at 5 29 09 PM](https://user-images.githubusercontent.com/94948064/158133831-34f57c26-9873-43aa-b5d7-b56e27f0aea1.png) ![News feed](https://user-images.githubusercontent.com/94948064/158133027-d097f797-4baf-42c8-918c-b016c6c21583.png) ![Report an incident](https://user-images.githubusercontent.com/94948064/158133048-57b1bb41-bdc2-4af4-9dd1-f79f6ca49e60.png) ![Routing](https://user-images.githubusercontent.com/94948064/158133071-ae5d32c5-776b-414e-85f1-e88458052d23.png)

<br>
App home: https://www.neighbor-hud.com
   
## Getting Started
### Setup

Install gems
```
bundle install
```
Install JS packages
```
yarn install
```

### ENV Variables
Create `.env` file
```
touch .env
```
Inside `.env`, set these variables. 
```
MAPBOX_API_KEY=your_own_mapbox_api_key
```

### DB Setup
```
rails db:create
rails db:migrate
rails db:seed
```

### Run a server
```
rails s
```

## Built With
- [Rails 6](https://guides.rubyonrails.org/) - Backend / Front-end
- [Stimulus JS](https://stimulus.hotwired.dev/) - Front-end JS
- [Heroku](https://heroku.com/) - Deployment
- [PostgreSQL](https://www.postgresql.org/) - Database
- [Bootstrap](https://getbootstrap.com/) — Styling
- [Figma](https://www.figma.com) — Prototyping

## Team Members
- [Nicole Ogawa](https://github.com/nogawa11/)
- [Ayanori Toyoda](https://github.com/AyanorII/)
- [Amane Weston](https://github.com/AmaneWeston/)
- [David Yarhi](https://github.com/policiacaro/)
