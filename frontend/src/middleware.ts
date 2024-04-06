import { NextRequest, NextResponse } from 'next/server';
import { refreshSession, verifyAuth } from './lib/auth';
import { errors } from 'jose';

const redirectToLogin = async (req: NextRequest) => {
  return NextResponse.redirect(new URL('/login', req.nextUrl));
};

export default async function middleware(req: NextRequest) {
  const token = req.cookies.get('Token');
  const refreshToken = req.cookies.get('Refresh-Token');
  if (!token && !refreshToken) {
    return redirectToLogin(req);
  }

  try {
    if (!token) {
      throw new errors.JWTExpired('JWT is expired');
    }
    await verifyAuth(token.value);
  } catch (err) {
    if (err instanceof errors.JWTExpired) {
      if (!refreshToken) {
        return redirectToLogin(req);
      }
      const cookiesHeader = await refreshSession(refreshToken.value);
      if (!cookiesHeader) {
        return redirectToLogin(req);
      }
      const res = NextResponse.next();
      res.headers.set('Set-Cookie', cookiesHeader);
      return res;
    } else {
      return redirectToLogin(req);
    }
  }
}

export const config = {
  matcher: ['/home']
};
