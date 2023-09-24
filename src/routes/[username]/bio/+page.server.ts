import type { PageServerLoad } from "./$types";
import { adminDB } from "$lib/server/admin";
import { error, redirect } from "@sveltejs/kit";

export const load = (async ({ locals, params }) => {
  console.log("why is it missing", locals.userID);
  const uid = locals.userID;
  console.log("why is it missing2", uid);

  if (!uid) {
    // either redirect or render an error page
    // to notify customer its an unauthorized request
    // redirect(301, '/login');
    //throw redirect(301, "/login");
    throw error(401, "Unauthorized request!");
  }
  const userDoc = await adminDB.collection("users").doc(uid).get();
  const { username, bio } = userDoc.data()!;

  if (params.username !== username) {
    throw error(401, "That username does not belong to you");
  }
  console.log(bio);
  return {
    bio,
  };
}) satisfies PageServerLoad;
