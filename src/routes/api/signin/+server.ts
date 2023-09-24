import { adminAuth } from "$lib/server/admin";
import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const POST: RequestHandler = async ({ request, cookies }) => {
  const { idToken } = await request.json();

  const expiresIn = 60 * 60 * 24 * 7 * 1000; // 5 days

  const decodedIdToken = await adminAuth.verifyIdToken(idToken);

  // The cookie only gets set if the user authenticated less than 5 minutes ago
  if (new Date().getTime() / 1000 - decodedIdToken.auth_time < 5 * 60) {
    const cookie = await adminAuth.createSessionCookie(idToken, { expiresIn });
    //add sameSite: strict for production, fix maxAge
    const options = {
      maxAge: expiresIn,
      httpOnly: true,
      secure: true,
      path: "/",
    };

    // firebase requires cookie to be named __session to cache it on their CDN
    cookies.set("__session", cookie, options);

    return json({ status: "signedIn" });
  } else {
    throw error(401, "Recent sign in required");
  }
};

export const DELETE: RequestHandler = async ({ cookies }) => {
  cookies.delete("__session", { path: "/" });
  return json({ status: "signedOut" });
};
