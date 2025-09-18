import { User } from "../generated/prisma";

export type SafeUser = Omit<
 User,
 "createdAt" | "updatedAt" | "emailVerified"
> & {
    createdAt: string;
    updatedAt: string;
    emailVerified: string | null;
};