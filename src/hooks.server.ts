import { adminAuth } from "$lib/server/admin";
import type { Handle } from "@sveltejs/kit";

export const handle = (async ({ event, resolve }) => {
  const sessionCookie = event.cookies.get("__session");

  try {
    const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie!);
    // sets userID on the event locals object
    // to easily access it from any other server.ts file
    event.locals.userID = decodedClaims.uid;
    console.log("found user id", decodedClaims.uid);
    console.log("locals object set to", event.locals.userID);
  } catch (e) {
    event.locals.userID = null;
    return resolve(event);
  }

  return resolve(event);
}) satisfies Handle;
