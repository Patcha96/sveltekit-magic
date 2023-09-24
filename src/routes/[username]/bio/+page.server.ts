import type { PageServerLoad } from "./$types";
import { adminDB } from "$lib/server/admin";
import { error, redirect, type Actions, fail } from "@sveltejs/kit";

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

export const actions = {
  default: async ({ locals, request, params }) => {
    const uid = locals.userID;

    const data = await request.formData();
    const bio = data.get("bio");

    const userRef = adminDB.collection("users").doc(uid!);
    const { username } = (await userRef.get()).data()!;

    if (params.username !== username) {
      throw error(401, "That username does not belong to you");
    }

    if (bio!.length > 260) {
      return fail(400, { problem: "Bio must be less than 260 characters" });
    }

    await userRef.update({
      bio,
    });
  },
} satisfies Actions;
