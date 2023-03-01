# Umami Meats
Umami Meats is an ecommerce site where users can view and buy various types of high-end steak and sushi.

## Technologies used

* **Next.js** - Fullstack React framework
* **React** - Foundation for user experience
* **Redux** - State management, implemented with Redux Toolkit
* **Sequelize** - ORM for interacting with PostgreSQL database
* **JWT** - Token creation/verification for user authentication

 ## Setup this repository locally
* Clone and setup the repository with the following commands:
```
git clone git@github.com:dexters-lab-fsa-2208/dexter.git
cd dexter
npm install
createdb dexter
npm run seed
```
*This installs all necessary packages, creates a postgres database, and seeds it with products, orders, and users.*
* Create a `.env.local` file containing an environment variable `JWT` (it can be any arbitrary string) 
	* Example: `JWT="Fh98xI5"`
* Run `npm run dev`
* View the project on http://localhost:3000
