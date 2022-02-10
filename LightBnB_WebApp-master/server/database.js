const properties = require("./json/properties.json");
const users = require("./json/users.json");
const { Pool } = require("pg");

const pool = new Pool({
  user: "vagrant",
  password: "123",
  host: "localhost",
  database: "lightbnb",
});
/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = (email) => {
  return pool
    .query(`SELECT * FROM users WHERE email = $1`, [email])
    .then((result) => {
      console.log(result.rows);
      return result.rows[0];
    })
    .catch((err) => {
      console.log(err.message);
      return null;
    });
  // let user;
  // for (const userId in users) {
  //   user = users[userId];
  //   if (user.email.toLowerCase() === email.toLowerCase()) {
  //     break;
  //   } else {
  //     user = null;
  //   }
  // }
  // return Promise.resolve(user);
};
exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = (id) => {
  return pool
    .query(`SELECT * FROM users WHERE id = $1`, [id])
    .then((result) => {
      // console.log(result.rows);
      return result.rows[0];
    })
    .catch((err) => {
      console.log(err.message);
      return null;
    });
};
exports.getUserWithId = getUserWithId;

/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser = (user) => {
  return pool
    .query(
      `INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *;`,
      [user.name, user.email, user.password]
    )
    .then((result) => {
      return result.rows[0];
    })
    .catch((err) => {
      console.log(err.message);
      return null;
    });
};
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function (guest_id, limit = 10) {
  return pool
    .query(
      `SELECT reservations.*, properties.*, AVG(rating) as average_rating
      FROM reservations
      JOIN properties ON property_id = properties.id
      JOIN property_reviews ON reservations.id = reservation_id
      WHERE reservations.guest_id = $1
      AND end_date < now()::date
      GROUP BY reservations.id, properties.id
      ORDER BY start_date
      LIMIT $2;`,
      [guest_id, limit]
    )
    .then((result) => {
      // console.log(result.rows[0]);
      return result.rows;
    })
    .catch((err) => {
      console.log(err.message);
      return null;
    });
};
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = (options, limit = 10) => {
  const queryParams = [];

  let queryString = `
  SELECT properties.*, avg(property_reviews.rating) as average_rating
  FROM properties
  JOIN property_reviews ON properties.id = property_id
  `;

  // if city passed in, returns city name including keyword
  if (options.city) {
    queryParams.push(`%${options.city}%`);
    queryString += `WHERE city LIKE $${queryParams.length} `;
  }

  // if owner_id passed in, returns properties
  if (options.owner_id) {
    queryParams.push(`%${options.owner_id}`);
    if (queryParams.length > 1) {
      queryString += `AND owner_id LIKE $${queryParams.length}`;
    }
    queryString += `WHERE owner_id LIKE $${queryParams.length}`;
  }

  // if min and max price passed in, return properties within
  if (options.minimum_price_per_night && options.maximum_price_per_night) {
    queryParams.push(`${options.minimum_price_per_night * 100}`);
    queryParams.push(`${options.maximum_price_per_night * 100}`);
    if (queryParams.length > 2) {
      queryString += `AND cost_per_night >= $${
        queryParams.length - 1
      } AND cost_per_night <= $${queryParams.length}`;
    } else {
      queryString += `WHERE cost_per_night >= $${
        queryParams.length - 1
      } AND cost_per_night <= $${queryParams.length}`;
    }
  }

  // if min rating passed in, return properties with rating above it
  if (options.minimum_rating) {
    queryParams.push(`${options.minimum_rating}`);
    if (queryParams.length > 1) {
      queryString += `AND `;
    } else {
      queryString += `WHERE `;
    }
    queryString += `rating >= $${queryParams.length}`;
  }

  queryParams.push(limit);
  queryString += `
  GROUP BY properties.id
  ORDER BY cost_per_night
  LIMIT $${queryParams.length};
  `;

  console.log(queryString, queryParams);

  return pool
    .query(queryString, queryParams)
    .then((res) => res.rows)
    .catch((err) => {
      console.log(err.message);
    });
};
exports.getAllProperties = getAllProperties;

/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = (property) => {
  // return pool
  //   .query(
  //     ` INSERT INTO properties(
  //     owner_id,
  //     title,
  //     description,
  //     thumbnail_photo_url,
  //     cover_photo_url,
  //     cost_per_night,
  //     street,
  //     city,
  //     province,
  //     post_code,
  //     country,
  //     parking_spaces,
  //     number_of_bathrooms,
  //     number_of_bedrooms)
  //     VALUES(
  //       $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12 $13, $14) RETURNING *;`,
  //     [
  //       property.owner_id,
  //       property.title,
  //       property.description,
  //       property.thumbnail_photo_url,
  //       property.cover_photo_url,
  //       property.cost_per_night,
  //       property.street,
  //       property.city,
  //       property.province,
  //       property.post_code,
  //       property.country,
  //       property.parking_spaces,
  //       property.number_of_bathrooms,
  //       property.number_of_bedrooms,
  //     ]
  //   )
  //   .then((result) => {
  //     return result.rows[0];
  //   })
  //   .catch((err) => {
  //     console.log(err.message);
  //     return null;
  //   });
};
exports.addProperty = addProperty;
