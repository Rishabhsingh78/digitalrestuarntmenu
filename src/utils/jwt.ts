import jwt from "jsonwebtoken";
import { env } from "~/env";

const JWT_SECRET = process.env.JWT_SECRET || "super-secret-secret";

export const signJwt = (payload: object) => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
};

export const verifyJwt = (token: string) => {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        return null;
    }
};
