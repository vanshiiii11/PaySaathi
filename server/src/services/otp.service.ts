import axios from 'axios';
import { prisma } from '../lib/prisma';
import crypto from 'crypto';

export const generateOtp = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const sendOtp = async (phone: string, otp: string): Promise<void> => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[DEV] OTP for ${phone}: ${otp}`);
    return;
  }
  
  try {
    const authKey = process.env.MSG91_AUTH_KEY;
    const templateId = process.env.MSG91_TEMPLATE_ID;
    
    if (authKey && templateId) {
      await axios.post('https://api.msg91.com/api/v5/otp', null, {
        params: {
          template_id: templateId,
          mobile: phone,
          authkey: authKey,
          otp: otp
        }
      });
    } else {
      console.warn('MSG91 credentials missing, simulating OTP send.');
    }
  } catch (error) {
    console.error('Error sending OTP:', error);
    throw new Error('Failed to send OTP');
  }
};

export const createOtpRecord = async (phone: string) => {
  const code = generateOtp();
  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + parseInt(process.env.OTP_EXPIRY_MINUTES || '10'));
  
  const record = await prisma.otpRecord.create({
    data: {
      phone,
      code,
      expiresAt,
    }
  });
  
  return { record, code };
};

export const verifyOtp = async (phone: string, code: string): Promise<boolean> => {
  const record = await prisma.otpRecord.findFirst({
    where: { phone },
    orderBy: { createdAt: 'desc' }
  });
  
  if (!record || record.verified) {
    return false;
  }
  
  if (new Date() > record.expiresAt) {
    return false;
  }
  
  await prisma.otpRecord.update({
    where: { id: record.id },
    data: { attempts: { increment: 1 } }
  });
  
  if (record.attempts >= 5) {
    return false;
  }
  
  if (record.code === code) {
    await prisma.otpRecord.update({
      where: { id: record.id },
      data: { verified: true }
    });
    return true;
  }
  
  return false;
};
