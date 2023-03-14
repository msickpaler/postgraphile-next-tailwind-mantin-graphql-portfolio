const express = require("express");
const admin = require("firebase-admin");
const { postgraphile } = require("postgraphile");
const config = require("./config/config.js");
const cors = require("cors");

const app = express();

admin.initializeApp({
  projectId: process.env.FIREBASE_PROJECT_ID,
});
const auth = admin.auth();

const corsOptions = {
  origin: process.env.WEB_HOST,
};
app.use(cors(corsOptions));

const { user, password, host, database, port, default_schema } =
  config.database;

app.use(
  postgraphile(
    process.env.DATABASE_URL ||
      `postgres://${user}:${password}@${host}:${port}/${database}`,
    default_schema,
    {
      watchPg: true,
      graphiql: true,
      enhanceGraphiql: true,
      retryOnInitFail: true,
      exportGqlSchemaPath: "schema.graphql",
      pgSettings: async (req) => {
        console.log("req.headers.authorization", req.headers.authorization);
        const token = req.headers.authorization
          ? req.headers.authorization.split("Bearer ")[1]
          : "";
        const decodedToken = token ? await auth.verifyIdToken(token) : "";
        return {
          role: process.env.DB_WRITE_USER,
          "jwt.claims.uid": decodedToken.uid,
        };
      },
    }
  )
);

app.listen(config.port || 3000);
