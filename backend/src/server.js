const { port } = require("./config/config");
const app = require("./app");
const connectDB = require("./config/db");

connectDB()
  .then(() => {
    const server = app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });

    server.on("error", (error) => {
      if (error.code === "EADDRINUSE") {
        console.error(
          `Port ${port} is already in use. Stop the process using this port or set a different PORT in .env.`
        );
        process.exit(1);
      }

      console.error("Server startup failed:", error.message);
      process.exit(1);
    });
  })
  .catch((error) => {
    console.error("Database connection failed:", error.message);
    process.exit(1);
  });
