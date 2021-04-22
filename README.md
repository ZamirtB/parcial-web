# Login / Register And Listing Data With
## NodeJS - EJS - MongoDB - Tailwindcss

Ready pages and API

# Steps to work
- Create a MongoDB Atlas Cluster
- Write cluster's url to '.env' file
- Create collection and enter name 'users'

## Installation Needed Modules

Install the dependencies and devDependencies and start the server.

```sh
npm install express ejs mongoose body-parser cookie-parser dotenv crypto jsonwebtoken jwt-decode

npm install tailwindcss postcss autoprefixer postcss-cli

npx tailwindcss init


# write this text in 'postcss.config.js'  file
module.exports = {
  plugins: [
    require('tailwindcss'),
    require('autoprefixer'),
  ]
} 
```

And create a css file and write that in css file
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

## Run
` node index.js `


Happy Coding :)
