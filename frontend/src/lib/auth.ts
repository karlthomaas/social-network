import { jwtVerify } from 'jose';
import { getBackendUrl } from './utils';

const getJwtSecretKey = () => {
  const secret = process.env.JWT_SECRET;

  if (!secret || secret.length === 0) {
    throw new Error('JWT_SECRET not defined');
  }
  return secret;
};

/**
 * Refreshes the user session using the provided refresh token.
 * @param refreshToken - The refresh token used to authenticate the user.
 * @returns A Promise that resolves to a string representing the updated session cookie, or null if an error occurs.
 */
export const refreshSession = async (refreshToken: string): Promise<string | null> => {
  const baseUrl = getBackendUrl()
  try {
    const res = await fetch(`${baseUrl}/api/refresh_session`, {
      method: 'POST',
      headers: {
        Cookie: `Refresh-Token=${refreshToken};`,
        'Content-Type': 'application/json',
      },
    });
    // console.log(res);
    return res.headers.get('set-cookie');
  } catch (error) {
    return null;
  }
};

/**
 * Verifies the authenticity of a JWT token.
 * 
 * @param token - The JWT token to be verified.
 * @returns The payload of the verified token.
 */
export const verifyAuth = async (token: string) => {
  const verified = await jwtVerify(token, new TextEncoder().encode(getJwtSecretKey()));
  return verified.payload;
};
