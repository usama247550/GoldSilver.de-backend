import cors from "cors"
const corsOptions = {
  origin: [
    process.env.FRONTEND_URL,        // production
    'http://localhost:3000',          // local dev
  ],
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
};

export default cors(corsOptions)