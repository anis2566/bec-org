import type { BetterAuthOptions } from "better-auth";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { oAuthProxy } from "better-auth/plugins";

import { prisma } from "@workspace/db";

function generateObjectId(): string {
  const timestamp = Math.floor(Date.now() / 1000).toString(16).padStart(8, '0');
  const machineId = Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, '0');
  const processId = Math.floor(Math.random() * 0xffff).toString(16).padStart(4, '0');
  const counter = Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, '0');
  return timestamp + machineId + processId + counter;
}

export function initAuth(options: {
  baseUrl: string;
  productionUrl: string;
  secret: string | undefined;
}): ReturnType<typeof betterAuth> {
  const config = {
    database: prismaAdapter(prisma, {
      provider: "mongodb",
    }),
    baseURL: options.baseUrl,
    secret: options.secret,
    advanced: {
      generateId: generateObjectId,
    },

    user: {
      fields: {
        email: "email",
        emailVerified: "emailVerified",
        name: "name",
        image: "image",
        createdAt: "createdAt",
        updatedAt: "updatedAt",
      },
      additionalFields: {
        role: {
          type: "string",
          defaultValue: "User",
        },
        status: {
          type: "string",
          defaultValue: "Pending",
        },
        phone: {
          type: "string",
          required: false,
        },
      },
      
    },

    account: {
      fields: {
        accountId: "accountId",
        providerId: "providerId",
        userId: "userId",
        accessToken: "accessToken",
        refreshToken: "refreshToken",
        idToken: "idToken",
        password: "password",
        createdAt: "createdAt",
        updatedAt: "updatedAt",
      },
    },

    session: {
      fields: {
        token: "sessionToken",
        userId: "userId",
        expiresAt: "expiresAt",
        ipAddress: "ipAddress",
        userAgent: "userAgent",
        createdAt: "createdAt",
        updatedAt: "updatedAt",
      },
    },

    plugins: [
      oAuthProxy({
        currentURL: options.baseUrl,
        productionURL: options.productionUrl,
      }),
    ],

    emailAndPassword: {
      enabled: true,
      minPasswordLength: 6,
      maxPasswordLength: 128,
    },

    trustedOrigins: [options.baseUrl, options.productionUrl],
  } satisfies BetterAuthOptions;

  return betterAuth(config);
}

export type Auth = ReturnType<typeof initAuth>;
export type Session = Auth["$Infer"]["Session"];
