import type { Request, Response } from "express";
import * as queries from "../db/queries";

import { getAuth } from "@clerk/express";

export async function syncUser(req: Request, res: Response) {
    try {
        const { userId } = getAuth(req);
        if(!userId) return res.status(401).json({ error: "Unauthorized" });

        const { email, name, imageUrl } = req.body;
        const emailValue = typeof email === "string" ? email.trim() : "";
        const nameValue = typeof name === "string" ? name.trim() : "";
        const imageUrlValue = typeof imageUrl === "string" ? imageUrl.trim() : "";

        if ( !emailValue || !nameValue || !imageUrlValue ) {
            return res.status(400).json({ error: "Email, name, and imageUrl are required" });
        }

        const user = await queries.upsertUser({
            id: userId,
            email: emailValue,
            name: nameValue,
            imageUrl: imageUrlValue
        });
        
        res.status(200).json(user);
    } catch (error) {
        console.error("Error syncing user:", error);
        res.status(500).json({ error: "Failed to sync user" });
    }
};