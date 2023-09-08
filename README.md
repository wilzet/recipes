# <img align="left" width="100" height="100" src="./public/favicon/android-chrome-512x512.png"> Meal-accounting-tool
A simple local web app for recipes and meal planning. 

## Needed to run:
* Make sure ```Node.js``` is installed. Run ```npm --version```.
* Add a ```.env(.local)```-file with variables from ```.env.example```.
* Create the directory ```data``` under the root directory and add a ```data/users.json``` file, which is a list of ```User``` objects. Make sure two users share ```name:``` with the corresponding ```.env(.local)``` variables.
* Run ```npm run build``` and then ```npm run start```, or simply run ```npm run dev``` for a development server with automatic refresh (thank you ```Next.js```).
