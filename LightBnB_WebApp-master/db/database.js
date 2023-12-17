const properties = require("./json/properties.json");
const users = require("./json/users.json");
const { Pool } = require("pg");

const pool = new Pool({
  user: "labber",
  password: "labber",
  host: "localhost",
  database: "lightbnb"
});

/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
//The promise should resolve with a user object with the given email address,
// or null if that user does not exist
const getUserWithEmail = function (email) {
  console.log("inside getUserWithEmail func ");
  return pool
    .query(`select * from users where email=$1`, [email]) // tristanjacobs@gmail.com
    .then((result) => {
      console.log("user:", result.rows[0]);
      return result.rows[0] || null;
    })
    .catch((err) => {
      console.log("Error::", err.message);
    });
};

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
//The promise should resolve with a user object with the given id,
// or null if that user does not exist
const getUserWithId = function (id) {
  console.log("inside getUserWithId func ");
  return pool
    .query(`select * from users where id=$1`, [id]) // tristanjacobs@gmail.com
    .then((result) => {
      console.log("user:", result.rows[0]);
      return result.rows[0] || null;
    })
    .catch((err) => {
      console.log("Error::", err.message);
    });
};

/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
//to insert the new user into the database
const addUser = function (user) {
  console.log("inside addUser func ");
  //RETURNING * --> to return the objects that were inserted
  return pool
    .query(`INSERT INTO users(name,email,password) VALUES($1,$2,$3) RETURNING *;`, [user.name, user.email, user.password]) // tristanjacobs@gmail.com
    .then((result) => {
      console.log("user:", result.rows[0]);
      return result.rows[0];
    })
    .catch((err) => {
      console.log("Error::", err.message);
    });
};

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
//to return reservations associated with a specific user
const getAllReservations = function (guest_id, limit = 10) {
  console.log("inside getAllReservations func ");
  return pool
    .query(`SELECT reservations.id,thumbnail_photo_url,title,cost_per_night,number_of_bathrooms,number_of_bedrooms,parking_spaces, start_date,end_date,
AVG(rating) AS average_rating FROM properties
JOIN reservations ON properties.id=reservations.property_id
JOIN property_reviews ON properties.id=property_reviews.property_id
WHERE reservations.guest_id=$1
GROUP BY reservations.id,properties.id
ORDER BY start_date
LIMIT $2;`, [guest_id, limit])
    .then((result) => {
      console.log("user:", result.rows);
      return result.rows;
    })
    .catch((err) => {
      console.log("Error::", err.message);
    });
};

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * options:{
    city,
    owner_id,
    minimum_price_per_night,
    maximum_price_per_night,
    minimum_rating;
   }
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
// to accept arguments that will enable filtering(can filter the list of properties based on city,
//minimum and maximum cost, and minimum rating)
const getAllProperties = function (options, limit = 10) {
  console.log('inside getAllProperties func , Limit value:', limit);
  const queryParams = [];

  let queryString = `
  SELECT properties.*, avg(property_reviews.rating) as average_rating
  FROM properties
  JOIN property_reviews ON properties.id = property_id
  `;
  //based on users filter options, appends below conditions to the select query
  if (options.city || options.owner_id || (options.minimum_price_per_night && options.maximum_price_per_night)) {
    console.log("inside if where clause, options::", options);
    queryString += `WHERE`;
  }

  if (options.city) {
    queryParams.push(`%${options.city}%`);
    queryString += ` city LIKE $${queryParams.length}`;//can use the length of the array to dynamically get the $n placeholder number
  }
  if (options.owner_id) {
    if (queryParams.length > 0) {
      queryString += ` AND`;
    }
    queryParams.push(Number(options.owner_id));
    queryString += ` owner_id = $${queryParams.length}`;
  }
  if (options.minimum_price_per_night && options.maximum_price_per_night) {
    if (queryParams.length > 0) {
      queryString += ` AND`;
    }
    //The database stores amounts in cents SO converting dollars to cents
    queryParams.push(Number(options.minimum_price_per_night) * 100);
    queryParams.push(Number(options.maximum_price_per_night) * 100);
    queryString += ` cost_per_night BETWEEN $${queryParams.length - 1} AND $${queryParams.length}`;
  }

  queryString += ` GROUP BY properties.id`;
  if (options.minimum_rating) {
    queryParams.push(Number(options.minimum_rating));
    queryString += ` HAVING AVG(property_reviews.rating)>=$${queryParams.length}`;
  }

  queryParams.push(limit);
  queryString += ` ORDER BY cost_per_night
  LIMIT $${queryParams.length};
  `;

  console.log(queryString, queryParams);
  //returns a promise
  return pool.query(queryString, queryParams)
    .then((result) => {
      // console.log(result.rows);
      return result.rows;
    })
    .catch((err) => {
      console.log(err.message);
    });
};

/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
//to save a new property to the properties table and returns a promise
const addProperty = function (property) {
  console.log("addProperty fn, property:", property);
  return pool.query(`insert into properties( owner_id,
    title,
    description,
    thumbnail_photo_url,
    cover_photo_url,
    cost_per_night,
    street,
    city,
    province,
    post_code,
    country,
    parking_spaces,
    number_of_bathrooms,
    number_of_bedrooms) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14) RETURNING *`,//to return the saved property in db
    [
      property.owner_id,
      property.title,
      property.description,
      property.thumbnail_photo_url,
      property.cover_photo_url,
      Number(property.cost_per_night),
      property.street,
      property.city,
      property.province,
      property.post_code,
      property.country,
      Number(property.parking_spaces),
      Number(property.number_of_bathrooms),
      Number(property.number_of_bedrooms)])
    .then((result) => {
      console.log(result.rows);
    })
    .catch((err) => {
      console.log("error:", err.message);
    })
};

module.exports = {
  getUserWithEmail,
  getUserWithId,
  addUser,
  getAllReservations,
  getAllProperties,
  addProperty,
};

