import { jwtVerify } from 'jose';

const getJwtSecretKey = () => {
  const secret = process.env.JWT_SECRET;

  if (!secret || secret.length === 0) {
    throw new Error('JWT_SECRET not defined');
  }
  return secret;
};

export const refreshSession = async (token: string, refreshToken: string): Promise<string | null> => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/authenticate`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        Cookie: `Refresh-Token=${refreshToken};`,
        'Content-Type': 'application/json',
      },
    });
    return res.headers.get('set-cookie');
  } catch (error) {
    return null;
  }
};

export const verifyAuth = async (token: string) => {
  const verified = await jwtVerify(token, new TextEncoder().encode(getJwtSecretKey()));
  return verified.payload;
};
