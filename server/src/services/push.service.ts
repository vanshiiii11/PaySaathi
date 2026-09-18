import { Expo } from 'expo-server-sdk';
import { prisma } from '../lib/prisma';

const expo = new Expo({ accessToken: process.env.EXPO_ACCESS_TOKEN });

export const sendPushNotification = async (expoPushToken: string, title: string, body: string, data?: object): Promise<void> => {
  if (!Expo.isExpoPushToken(expoPushToken)) {
    console.error(`Push token ${expoPushToken} is not a valid Expo push token`);
    return;
  }

  const messages = [{
    to: expoPushToken,
    sound: 'default' as const,
    title,
    body,
    data,
  }];

  try {
    const chunks = expo.chunkPushNotifications(messages);
    for (const chunk of chunks) {
      await expo.sendPushNotificationsAsync(chunk);
    }
  } catch (error) {
    console.error('Error sending push notification:', error);
  }
};

export const sendPushToUser = async (userId: string, title: string, body: string, data?: object): Promise<void> => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { expoPushToken: true }
  });
  
  if (user?.expoPushToken) {
    await sendPushNotification(user.expoPushToken, title, body, data);
  }
};
