import { NextFetchEvent, NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
// import { jwt } from '../../utils';

export async function middleware(req: NextRequest, ev: NextFetchEvent) {
  const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!session) {
    const requestedPage = req.page.name;
    return NextResponse.redirect(`${process.env.HOST_NAME}auth/login?p=${requestedPage}`);
  }

  return NextResponse.next();

  // const { token = '' } = req.cookies;
  // try {
  //   if (token.length <= 10) {
  //     throw new Error('Token no válido');
  //   }
  //   // await jwt.isValidToken(token);
  //   return NextResponse.next();
  // } catch (error) {
  //   const requestedPage = req.page.name;
  //   return NextResponse.redirect(
  //     `http://localhost:3000/auth/login?p=${requestedPage}`
  //   );
  // }
}
