# Pedal Out App Backend
Hosted Version can be found here: https://pedal-out-be.onrender.com/api
Frontend Repo: https://github.com/theskywillbeblue/pedal-out-FE

# The Project:
- This repo forms the backend of a full-stack app called Pedal Out. This repo has been used to build the API that is then accessible by the Frontend to built out the UI/UX of the app.
- Pedal Out is a social platform built to encourage and facilitate bike meet-ups. From mountain biking to casual rides, Pedal Out
allows users to find nearby rides, post their own and meet new people with a shared love for biking. It's an opportunity for 
users to find enjoyment and community in a sport which is often paired with competition and comparison on other platforms.
- The project has utilised non-relational (MongoDB) and relational (postgreSQL) databases to form the API.

# Setup Instructions:
1. Check Node.js and Postgres Versions:
    - Run `npm node --version` to see the current version of Node.js. Must be minimum v23.5.0 to run this repo
    - Run `npm postgres --version` to see the current version of Postgres. Must be minimum 14.15 (Homebrew)
    - Run `npm mongodb --version` to see the current version of MongoDB. Must be minimum 10.9.0
2. Install Dependencies:
    - Run `npm i` to install all dependencies
3. Setup your MongoDB database
    - Go to MongoDB and create (or login to) your account for Atlas
    - Create a new cluster - name this something appropriate like 'pedal-out'
    - Within this, create a 4 databases, each with a collection in:
        1. database: friends-dev, collection: dev-friends-data
        2. database: friends-test, collection: test-friends-data
        3. database: live-chat, collection: chat-room-test
        4. database: live-chat-dev, collection: chat-rooms
    - Create your connection link by pressing 'Connect' on your cluster and copying the Drivers link. This will need to be used in your .env files to connect to the MongoDB databases
    - Navigate to the 'Network Access' tab in the left-hand toolbar on MongoDB and make sure your IP address is listed here so that your tests successfully run
4. Setup Supabase database
    - As Supabase is used for the authentication on the app, we will need access to the database directly in the backend repo for information that isn't seeded through this repo (e.g. usernames, emails etc.)
    - Once created an account, copy your unique Supabase Anon Key and Supabase URL. These will be used in the .env files
3. Create .env files:
    - Create a .env.test file containing the code:
        `PGDATABASE=pedal_out_test`
        `MONGODB_URI=<yourUniqueMongoURI>`
        `SUPABASE_URL=<yourUniqueSupabaseURL>`
        `SUPABASE_ANON_KEY=<yourSupabaseAnonKey>`
    - Create a .env.development file containing the code:
        `PGDATABASE=pedal_out`
        `MONGODB_URI=<yourUniqueMongoURI>`
        `SUPABASE_URL=<yourUniqueSupabaseURL>`
        `SUPABASE_ANON_KEY=<yourSupabaseAnonKey>`
    - Create a .env.production file containing the code:
        `DATABASE_URL=<yourSupabaseDatabaseURLOnceHosted>`
        `MONGODB_URI=<yourUniqueMongoURI>`
        `SUPABASE_URL=<yourUniqueSupabaseURL>`
        `SUPABASE_ANON_KEY=<yourSupabaseAnonKey>`
    - Check these files are within the .gitignore file
5. Seed the Databases:
    - Run `npm run setup-dbs` in the terminal
    - Run `npm run seed-dev` in the terminal. Here you should see a console.log Connected to nc_news.
    - Run `npm test` in the terminal to check that the test files are correctly connected to the test data. Here you should see a console.log Connected to nc_news_test. Note, your MongoDB database will spin down every day, so you'll need to login for any MongoDB tests to run.
6. Running Tests:
    - To run all tests: `npm test`
    - To run specific test files `npm test <testFilePath>`
