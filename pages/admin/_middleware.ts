import { NextFetchEvent, NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest, ev: NextFetchEvent) {
  const session: any = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET
  });

  if (!session) {
    const requestedPage = req.page.name;
    return NextResponse.redirect(
      new URL(`/auth/login?p=${requestedPage}`, req.url)
    );
  }

  const validRoles = ['admin', 'super-user', 'SEO'];

  if (!validRoles.includes(session.user.role)) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  return NextResponse.next();
}
