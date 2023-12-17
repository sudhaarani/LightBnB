# LightBnB Project

A simple multi-page Airbnb clone that uses a server-side Javascript to display information from queries to web pages via SQL queries.

## Project Structure

```
.
├── db
│   ├── json
│   └── database.js
├── public
│   ├── javascript
│   │   ├── components
│   │   │   ├── header.js
│   │   │   ├── login_form.js
│   │   │   ├── new_property_form.js
│   │   │   ├── property_listing.js
│   │   │   ├── property_listings.js
│   │   │   ├── search_form.js
│   │   │   └── signup_form.js
│   │   ├── libraries
│   │   ├── index.js
│   │   ├── network.js
│   │   └── views_manager.js
│   ├── styles
│   │   ├── main.css
│   │   └── main.css.map
│   └── index.html
├── routes
│   ├── apiRoutes.js
│   └── userRoutes.js
├── styles
│   ├── _forms.scss
│   ├── _header.scss
│   ├── _property-listings.scss
│   └── main.scss
├── .gitignore
├── package-lock.json
├── package.json
├── README.md
└── server.js
```

* `db` contains all the database interaction code.
  * `json` is a directory that contains a bunch of dummy data in `.json` files.
  * `database.js` is responsible for all queries to the database. It doesn't currently connect to any database, all it does is return data from `.json` files.
* `public` contains all of the HTML, CSS, and client side JavaScript.
  * `index.html` is the entry point to the application. It's the only html page because this is a single page application.
  * `javascript` contains all of the client side javascript files.
    * `index.js` starts up the application by rendering the listings.
    * `network.js` manages all ajax requests to the server.
    * `views_manager.js` manages which components appear on screen.
    * `components` contains all of the individual html components. They are all created using jQuery.
* `routes` contains the router files which are responsible for any HTTP requests to `/users/something` or `/api/something`.
* `styles` contains all of the sass files.
* `server.js` is the entry point to the application. This connects the routes to the database.

## Getting Started

1. Clone this repository.
2. Install dependencies using the `npm install` command.
3. Update your database by running the following commangs in your psql
```
   \i migrations/01_schema.sql
   \i seeds/01_seeds.sql
   \i seeds/02_seeds.sql
   ```
4. To start the web server
```
   cd LightBnB_WebApp-master
   npm run local
   ```
5. The app will be served at <http://localhost:3000/> in your browser.

## Dependencies

- Express
- Node 5.10.x or above
- bcrypt
- cookie-session
- nodemon
- pg
- i

## A Short Description about the Lighthouse BnB

Lighthouse BnB is an app that will revolutionize the travel industry. It will allow homeowners to rent out their homes to people on vacation, creating an alternative to hotels. Users can view property information, book reservations, view their reservations, and write reviews.

## Learning Objectives

  - Explain the importance and application of SQL/relational databases for web applications.
  - Describe the key components that make up a relational database.
  - Design database tables using primary and foreign keys correctly.
  - Determine if a data model should use one-to-many or many-to-many relationships when designing relational databases.
  - Utilize SELECT statements to solve common data query questions involving GROUP BY, WHERE, LIMIT, ORDER.
  - Utilize CREATE, UPDATE, DELETE statements to modify existing database table structure and records.
  - Use JOIN statements to combine information from related tables to build more complex result sets.
  - Use asynchronous (promise-based) postgres JS libraries to query data from Node applications.
  - Use the psql CLI to interact with and explore a database.
  - Research database queries through documentation and other references.

## Final Product
![Create_listing.png](https://github.com/sudhaarani/LightBnB/blob/master/screenshots/Create_listing.png)
![Login.png](https://github.com/sudhaarani/LightBnB/blob/master/screenshots/Login.png)
![My_listings.png](https://github.com/sudhaarani/LightBnB/blob/master/screenshots/My_listings.png)
![Search.png](https://github.com/sudhaarani/LightBnB/blob/master/screenshots/Search.png)
