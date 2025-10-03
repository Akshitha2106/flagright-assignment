import neo4j from "neo4j-driver";
import dotenv from "dotenv";
import createApp from "./app.js";

dotenv.config();

// Neo4j driver setup
const driver = neo4j.driver(
  process.env.NEO4J_URI || "bolt://127.0.0.1:7687",
  neo4j.auth.basic(
    process.env.NEO4J_USERNAME || "neo4j",
    process.env.NEO4J_PASSWORD || "test1234"
  )
  // { encrypted: "ENCRYPTION_OFF" } // disable TLS if server.bolt.tls_level=DISABLED
);

// Create Express app
const app = createApp(driver);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));

// Close driver gracefully on exit
process.on("exit", async () => {
  await driver.close();
});
process.on("SIGINT", async () => {
  await driver.close();
  process.exit();
});
process.on("SIGTERM", async () => {
  await driver.close();
  process.exit();
});
