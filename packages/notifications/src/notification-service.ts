import admin from "firebase-admin";
import { prisma } from "@workspace/db";

const privateKey =
  "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCU8GfcedQkBb14\nTqj5GuVp3KCZC8mJ43r8GlzxLCv2H8Ncd4a9B5tI1OC2E9p3yLwxczVnTbtBnf6x\ncl9L6eTcDC7NR+oWS+1LzyAm+QIcCx3tmNoYKCAW286FP6pMzbWRpPtJNxa1HJEd\njp3OiWnFMXljqocahSXXJmhYGgsyOThZhObQbvOiJft7kFcDH8Bgrtpsn2iGWFW9\n7kZQcv+nILQjIC2WuQr+SJGAAM8jbr+bx4xRq/hzsh6c1NpG5vwZVtYOPqFAv1FM\nr6GW2rirNNcj27EzL1JWf88jXHdpNulDPto4t6AfCjViljhTbIq71oHqkzPzgILv\nc58s72/tAgMBAAECggEAGi1t59Gu4Fz06gQTTWM1jsd1H6kzdU2a9Fvy2X28xU/c\nX7BvaWKAn8qwqzfulk6dCyj3ai5+muAY35ndV4Om0qk+gZyh72TNcp1XRppODV1D\n15qdvJCy4SmlkQR5W3Htd4mSlBH/Zvo8JECIioBa64qQThzvDZF47umEffWn4Z3p\ntRZ0J0gK41UJn7aHazpk5+SNVXGyRz/HMZxRI+wHuQ83lEFaz8f2T6yhEH7V0AY4\n8o/Bru7q/hznM0eeksnL8shc6SgPhpffltvxtlLhF2D6UT53CbTI1lfvJecI85Rj\n9xrLLYt2qxTCdgP7+DGwbZLSwolnMCsDjQYzS8V7+QKBgQDRHT/zjhg5DL/JDam0\neqHtD5qzIMEfu8uHTQHGtl7mEoSSdqwzg+05M8VdpSL2/D31pQbnJ75BSwi6IpBL\n5mFVE89o1TFh2F3RW0qL0cdLfXiCq5gK4cQlRpkssZRFvnv/QKrvHtBiSlh4aLiH\nWxzev+RrpUM/OFYKvfWELvzDJQKBgQC2VTftQkGzWMFhTRDxLjEAxsDn9jgtlA89\nDjrDMVotMRbdLvlmpK8GgqrKWhJN5v5zZIKIcgGhYMUk44zF1zXHAx8wVon2dR+V\nQE7oqLLUORXaG2z5xfaI3Rm5PrjvOrizphK4ZMqmfb9gq8fsLvxgcT3fAybKfG6w\nT0d1hOPDKQKBgGW2aXXI5sVRCzP63lG32G0bSu7X/re1u3CLJ1MFP7F+zlcDPA0u\nnUNWiChde11RIb4K0Am9ThAqNAt9ZlxUqYEdSqQ+Fm/2MuPzGJZbqilw1R4R4rlg\nSOysozKXCXzHAz8LsFjwzwEQEmo23ZKQ4cEC61LkponomAlPjk0GIdG1AoGAIj4W\n5sQOurPsfW2PxPu70D2DdQzUuBqaUgkeGBJosRwLAzcTN6euBzb7BE2uKls7Zkh2\nC1H95GTcIXVqtq0YOGvpq5ZVCqgsakdNinxEOX8PD4sfCDmZd1Kuxg91g9gvX+3M\njjy/okzzaCBax4x7cVFTIVLiMhz0XMBG11dBvyECgYEAoTPtecxGZRZxVys5Kbzt\nr4YdJ/U4KZ2Cm1W1XGIu1vIGc9mEJLKS8dn8Ivuoq4ssTAbm1kWo8hh5t7TgPBfh\nb6+8bW8zBBfJtXRqV6JXe6wsQqhO6TSXzOHZcHS/hODY1g4EGj2JQHN7m9ZrUR4Z\nR1us6+//uaR4wKnnHupME60=\n-----END PRIVATE KEY-----\n";

// Initialize Firebase Admin (only once)
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: "basic-org",
      clientEmail: "firebase-adminsdk-fbsvc@basic-org.iam.gserviceaccount.com",
      privateKey: privateKey.replace(/\\n/g, "\n"),
    }),
  });
}

interface NotificationPayload {
  title: string;
  body: string;
  imageUrl?: string;
  data?: Record<string, string>;
  url?: string;
}

// ------------------- Send Notification to a Single User -------------------
export async function sendNotificationToUser(
  userId: string,
  payload: NotificationPayload
) {
  try {
    // Fetch active tokens for the user
    const tokens: { token: string }[] = await prisma.fcmToken.findMany({
      where: { userId, isActive: true },
      select: { token: true },
    });

    if (tokens.length === 0) {
      console.log(`No active tokens for user ${userId}`);
      return { success: false, reason: "no_tokens" };
    }

    // Prepare message
    const message = {
      notification: {
        title: payload.title,
        body: payload.body,
        imageUrl: payload.imageUrl,
      },
      data: {
        ...payload.data,
        url: payload.url || "/",
      },
      tokens: tokens.map((t) => t.token),
    };

    // Send notifications
    const response = await admin.messaging().sendEachForMulticast(message);

    console.log(`✅ Sent ${response.successCount} notifications`);
    console.log(`❌ Failed ${response.failureCount} notifications`);

    // Handle failed tokens
    if (response.failureCount > 0) {
      const failedTokens: string[] = [];

      response.responses.forEach((resp, idx) => {
        const failedToken = tokens[idx]?.token;
        if (!resp.success && failedToken) {
          failedTokens.push(failedToken);
          console.error(`Failed token: ${failedToken}`, resp.error);
        }
      });

      if (failedTokens.length > 0) {
        await prisma.fcmToken.updateMany({
          where: { token: { in: failedTokens } },
          data: { isActive: false },
        });
      }
    }

    return {
      success: true,
      successCount: response.successCount,
      failureCount: response.failureCount,
    };
  } catch (error) {
    console.error("Error sending notification:", error);
    return { success: false, error };
  }
}

// ------------------- Send Notification to Multiple Users -------------------
export async function sendNotificationToMultipleUsers(
  userIds: string[],
  payload: NotificationPayload
) {
  const results = await Promise.allSettled(
    userIds.map((userId) => sendNotificationToUser(userId, payload))
  );

  return results;
}

// ------------------- Broadcast Notification to All Users -------------------
export async function broadcastNotification(payload: NotificationPayload) {
  try {
    const tokens: { token: string }[] = await prisma.fcmToken.findMany({
      where: { isActive: true },
      select: { token: true },
    });

    if (tokens.length === 0) {
      return { success: false, reason: "no_tokens" };
    }

    // Firebase allows max 500 tokens per request
    const chunks: string[][] = [];
    for (let i = 0; i < tokens.length; i += 500) {
      chunks.push(tokens.slice(i, i + 500).map((t) => t.token));
    }

    let totalSuccess = 0;
    let totalFailure = 0;

    for (const chunk of chunks) {
      const message = {
        notification: {
          title: payload.title,
          body: payload.body,
          imageUrl: payload.imageUrl,
        },
        data: {
          ...payload.data,
          url: payload.url || "/",
        },
        tokens: chunk,
      };

      const response = await admin.messaging().sendEachForMulticast(message);
      totalSuccess += response.successCount;
      totalFailure += response.failureCount;

      // Handle failed tokens for this chunk
      if (response.failureCount > 0) {
        const failedTokens: string[] = [];
        response.responses.forEach((resp, idx) => {
          const failedToken = chunk[idx];
          if (!resp.success && failedToken) {
            failedTokens.push(failedToken);
            console.error(`Failed token: ${failedToken}`, resp.error);
          }
        });

        if (failedTokens.length > 0) {
          await prisma.fcmToken.updateMany({
            where: { token: { in: failedTokens } },
            data: { isActive: false },
          });
        }
      }
    }

    return {
      success: true,
      successCount: totalSuccess,
      failureCount: totalFailure,
    };
  } catch (error) {
    console.error("Error broadcasting notification:", error);
    return { success: false, error };
  }
}
