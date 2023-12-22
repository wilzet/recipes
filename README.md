# <img align="left" width="100" height="100" src="./public/favicon/android-chrome-512x512.png"> Meal-accounting-tool
A simple local web app for recipes and meal planning. 

## Getting started
- Install [`Node.js`](https://nodejs.org/en), for example by using [`nvm`](https://github.com/nvm-sh/nvm):
  - Install `nvm`, the node version manager.
  - Run `nvm install 18.17.1`, or `nvm ls` and choose your preferred version of `Node.js`.
- Make sure `node --version` >= `18.17.1` and `npm --version` >= `9.6.7`.
- Clone [this](https://github.com/wilzet/recipes) git repository.
- Create a file named `.env` based on `.env.example`.
- Run `npm install`.
- Run `npx prisma migrate dev --name init` to initialize the database.
- Run `npm run dev`.

## History
* #### 230903
  > Idea conceived and began working on the project.
  > - Simple prototype using external read/write
  > 
* #### 230908
  > Migrated the project to this current repository.
  > - Proper database using Prisma
  > - Important core features implemented
  >   - Users
  >   - Posts
  >   - Calendar
  > 
* #### 231010(ish)
  > Pre-alpha state
  > - New layout
  > - Valuable features
  >   - Comments
  >   - Ratings
  > 
* #### 231124
  > Alpha state
  > - The app is succesfully running on a Raspberry Pi 3 A+
  >   - This required the swap memory to be increased (100MB --> 1024MB)
  > - Refactoring and redesign
  > - Better score calculation [WIP]
  > 
