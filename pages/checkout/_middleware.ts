import { NextFetchEvent, NextRequest, NextResponse } from 'next/server';
// import { jwt } from '../../utils';

export async function middleware(req: NextRequest, ev: NextFetchEvent) {
  const { token = '' } = req.cookies;

  try {
    if (token.length <= 10) {
      throw new Error('Token no válido');
    }
    // await jwt.isValidToken(token);
    return NextResponse.next();
  } catch (error) {
    const requestedPage = req.page.name;

    return NextResponse.redirect(
      `http://localhost:3000/auth/login?p=${requestedPage}`
    );
  }
}
