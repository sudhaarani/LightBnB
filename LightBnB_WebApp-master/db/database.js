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
const getUserWithEmail = function (email) {
  // let resolvedUser = null;
  // for (const userId in users) {
  //   const user = users[userId];
  //   if (user && user.email.toLowerCase() === email.toLowerCase()) {
  //     resolvedUser = user;
  //   }
  // }
  // return Promise.resolve(resolvedUser);
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
const getUserWithId = function (id) {
  // return Promise.resolve(users[id]);
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
const addUser = function (user) {
  // const userId = Object.keys(users).length + 1;
  // user.id = userId;
  // users[userId] = user;
  // return Promise.resolve(user);
  console.log("inside addUser func ");
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
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = function (options, limit = 10) {
  console.log('Limit value:', limit);
  return pool
    .query(`SELECT * FROM properties LIMIT $1`, [limit])
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
const addProperty = function (property) {
  const propertyId = Object.keys(properties).length + 1;
  property.id = propertyId;
  properties[propertyId] = property;
  return Promise.resolve(property);
};

module.exports = {
  getUserWithEmail,
  getUserWithId,
  addUser,
  getAllReservations,
  getAllProperties,
  addProperty,
};
