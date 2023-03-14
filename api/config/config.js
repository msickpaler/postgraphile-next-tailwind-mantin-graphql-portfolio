module.exports = {
  port: process.env.API_PORT || 3000,
  cors_allow_origin: "",
  cors_allow_headers: "",
  database: {
    database: process.env.POSTGRES_DB,
    user:
      process.env.NODE_ENV === "production"
        ? process.env.DB_WRITE_USER
        : process.env.DB_ADMIN_USER,
    password:
      process.env.NODE_ENV === "production"
        ? process.env.DB_WRITE_PASS
        : process.env.DB_ADMIN_PASS,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    default_schema: process.env.DB_DEFAULT_SCHEMA,
  },
};
