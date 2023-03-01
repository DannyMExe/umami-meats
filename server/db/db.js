const Sequelize = require('sequelize');
const pg = require('pg');

const config = {};

if (process.env.QUIET) {
	config.logging = false;
}

const db = new Sequelize({
	database: 'testdbfordeploy',
	username: 'postgres',
	password: 'password',
	host: 'testdb.czw8tftookde.us-east-1.rds.amazonaws.com',
	port: 5432,
	dialect: 'postgres',
	dialectModule: pg,
	dialectOptions: {
		ssl: {
			require: true, // This will help, but cause error
			rejectUnauthorized: false, // This will fix error
		},
	},
});

// const db = new Sequelize(
//   process.env.DATABASE_URL || "postgres://localhost/dexter",
//   {
//     dialect: "postgres",
//     dialectOptions: {
//       ssl: process.env.DATABASE_URL ? {
//         require: true,
//         rejectUnauthorized: false,
//       } : false,

//     },
//     logging: false,
//   }
// );

module.exports = db;
