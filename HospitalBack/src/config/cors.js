export const corsOptions = {
  origin: (origin, callback) => {
    // allow Postman / server requests
    if (!origin) return callback(null, true);

    // allow localhost (dev)
    if (origin.startsWith("http://localhost")) {
      return callback(null, true);
    }

    // allow all Netlify domains (preview + prod)
    if (origin.endsWith(".netlify.app")) {
      return callback(null, true);
    }

    // block everything else
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  optionsSuccessStatus: 200,
};
