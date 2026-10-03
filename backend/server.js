// Handle uncaught exceptions FIRST
process.on("uncaughtException", (err) => {
    console.error(`Error: ${err.message}`);
    console.error("Shutting down the server due to uncaught exception");
    process.exit(1);
});

const app = require("./app");
const connectDatabase = require("./config/database");

// Connect to database
connectDatabase();

// Set PORT with fallback
const PORT = process.env.PORT || 5000;

// Start server
const server = app.listen(PORT, () => {
    console.log(
        `Server is working on http://localhost:${PORT} in ${process.env.NODE_ENV || "development"} mode`
    );
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
    console.error(`Error: ${err.message}`);
    console.error("Shutting down the server due to unhandled promise rejection");

    server.close(() => {
        process.exit(1);
    });
});