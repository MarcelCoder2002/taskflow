import { betterAuth } from "better-auth";
import {zenstackAdapter} from "@zenstackhq/better-auth";
import { db } from "./db";

export const auth = betterAuth({
	database: zenstackAdapter(db, {
		provider: "postgresql",
	}),
	emailAndPassword: {
		enabled: true,
		requireEmailVerification: false, // Simplified for MVP
	},
	session: {
		expiresIn: 60 * 60 * 24 * 7, // 7 days
		updateAge: 60 * 60 * 24, // Update every 24h
	}
});

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;