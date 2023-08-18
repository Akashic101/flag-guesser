# Flag Guesser

<img src="./public/logo512.png" alt="Flag Guesser logo" align="right" width="120" height="120">

Flag Guesser is a small, simple and lightweight game to test the users skills in the flag-knowledge

## How It Works

1. FG chooses four random countries from a list of 195. It then randomly chooses one of the four that will
   be the flag the user will be tested on. The user can choose the continents the game selects countries from
   as well in the header where he can also reset the score.
2. The SVG of the flag gets rendered and the user then chooses the country from the previous made selection
   of four countries. After making his decision the game will inform the user if his choice was the correct
   or wrong one and update the score accordingly.
3. If the user chose wrong the correct country will also be displayed

## Patch Notes

**Version 0.2.1**
* Removed chance of duplicates occurring
  * (Please report back if you notice less repeating countries)
* Added better end-card after a game
* Added score
* Added more countries
* Added hint-button
  * The hint is currently - unless in very rare cases - only the capital of the country. These will gradually be replaced with a better fitting fact about the country (suggestions welcome)
  
**Version 0.2.0**
* Added score and stats
* Cleaned up build-process and dependencies

**Version 0.1.0**
* Added selectable continents
* Added 1.minute game
* Improved mobile layout
* Improved UI/UX

## Roadmap
* Show breakdown on scoreboard of how many countries in each continent the user guessed correctly
* Add better hints for each country
* Further minimize the chance of repeating countries
* More game-modes

## Installation

There are two ways to install and run FG

### Docker

Run the command `docker run -p 3000:3000 --name flag-guesser akashic/flag-guesser:latest` to automatically
download, install and run the container. You can then access the website at `http://localhost:3000/`

### NPM

1. Clone the repository: `https://github.com/Akashic101/flag-guesser.git`
2. Navigate into the folder: `cd flag-guesser`
3. Install the necessary dependencies: `npm install`
4. Start the application: `npm start`

You can access the application just like with Docker at `http://localhost:3000/`
