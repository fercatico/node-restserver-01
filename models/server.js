const express = require("express");
const cors = require("cors");
const { dbConnection } = require("../db/config");

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;

    this.paths = {
      auth: "/api/auth",
      categories: '/api/categories',
      products: '/api/products',
      search: '/api/search',
      users: "/api/users",
    };

    //Connect to the database
    this.connectDB();

    //Middlewares
    this.middlewares();

    //Rutas de mi applicacion
    this.routes();
  }

  async connectDB() {
    await dbConnection();
  }

  middlewares() {
    //Cors
    this.app.use(cors());

    //Lectura y parse del body
    this.app.use(express.json());

    //Directorio Publico
    this.app.use(express.static("public"));
  }

  routes() {
    this.app.use(this.paths.auth, require("../routes/auth"));
    this.app.use(this.paths.categories, require("../routes/categories"));
    this.app.use(this.paths.products, require("../routes/products"));
    this.app.use(this.paths.search, require("../routes/search"));
    this.app.use(this.paths.users, require("../routes/users"));
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log("Servidor Corriendo en puerto", this.port);
    });
  }
}

module.exports = Server;
