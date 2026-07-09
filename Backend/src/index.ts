import express from "express";
import cors from "cors";
import path from "path";

import { ENV } from "./config/env";
import { clerkMiddleware } from '@clerk/express'

import userRoutes from "./routes/userRoutes";
import productRoutes from "./routes/productRoutes";
import commentRoutes from "./routes/commentRoutes";

const app = express();

// credentials: true allows cookies to be sent in cross-origin requests,
// which is essential for maintaining user sessions and authentication states
// when the frontend and backend are hosted on different domains or ports.
app.use(cors({origin: ENV.FRONTEND_URL, credentials: true}));
app.use(clerkMiddleware());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/health", (req, res) => {
    res.json({ 
        message: "Welcome to Productify API - Powered by PostgreSQL, Drizzle ORM & Clerk Auth",
        endpoints: {
            users: "/api/users",
            products: "/api/products",
            comments: "/api/comments",
        },
     });
});

app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/comments", commentRoutes);

if(ENV.NODE_ENV === "production") {
    const __dirname = path.resolve();

    // Serve static files from frontend/dist
    app.use(express.static(path.join(__dirname, "../Frontend/dist")));

    // Handle SPA rounting by sending index.html for any unmatched routes
    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../Frontend/dist/index.html"));
    });
};

app.listen(ENV.PORT, () => console.log(`Server is running on port ${ENV.PORT}`));