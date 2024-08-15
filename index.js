const express = require("express");
const morgan = require("morgan");
const cookieparser = require("cookie-parser");

require("dotenv").config({ path: "./config.env" });

const { ApiError } = require("./utils/errorHandler");

const cors = require("cors");

const { globalErrorHandler } = require("./middlewares/error.middleware");

const { mongoConnect } = require("./config/mongoConnection");
const { createAdmin } = require("./config/automaticAdminCreation");

const authRoute = require("./routes/auth.route");
const userRoute = require("./routes/user.route");
const roleRoute = require("./routes/role.route");
const { Country, State, City } = require('country-state-city');

const app = express();

const PORT = process.env.PORT || 3000;

// Global Usage Middlewares
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`node: ${process.env.NODE_ENV}`);
}

app.use(
  cors({
    origin: "*",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// for handling refresh tokens

app.use(cookieparser());

// Routes

// start country and state and city routes
const countryRoutes = require('./routes/countryRoutes');
const stateRoutes = require('./routes/stateRoutes');
const cityRoutes = require('./routes/cityRoutes');
app.use('/api', countryRoutes);
app.use('/api', stateRoutes);
app.use('/api', cityRoutes);
// end country and state and city routes

app.use("/api/v1/auth", authRoute.router);
app.use("/api/v1/users", userRoute.router);
app.use("/api/v1/roles", roleRoute.router);

// Global Error Handling Middleware
app.all("*", (req, res, next) => {
  // Create Error and send it to error handling middleware
  next(
    new ApiError(
      `Can't find this route ${req.originalUrl} on this server!`,
      400
    )
  );
});



// Global Error Handling Middleware for express
app.use(globalErrorHandler);

async function startServer() {
  createAdmin();
  await mongoConnect()
    .then((conn) =>
      console.log(
        `Database is connected to ${conn.connection.name}db and its host is ${conn.connection.host}`
      )
    )
    .catch((err) => {
      console.error("Database connection error: ", err);
      process.exit(1);
    });
  app.listen(PORT, () => {
    console.log(`Server started on port ${PORT} on http://localhost:${PORT}`);
  });
}

startServer();
