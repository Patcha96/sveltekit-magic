<script lang="ts">
  import AuthCheck from "$lib/components/AuthCheck.svelte";
  import { user, userData, storage, db } from "$lib/firebase";
  import { doc, updateDoc } from "firebase/firestore";
  import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

  let previewURL: string;
  let uploading = false;

  async function upload(e: any) {
    uploading = true;
    const file = e.target.files[0];
    // Create object URL using global URL object built into the browser
    // allowing preview of file being uploaded
    previewURL = URL.createObjectURL(file);
    // Set reference path for upload location in storage
    const storageRef = ref(storage, `users/${$user!.uid}/profile.png`);
    // Upload to storage using reference path provided
    const result = await uploadBytes(storageRef, file);
    // Get download URL from storage once finished uploading
    const url = await getDownloadURL(result.ref);

    // Update profile photo URL in db
    await updateDoc(doc(db, "users", $user!.uid), { photoURL: url });
    uploading = false;
  }
</script>

<AuthCheck>
  <h2 class="card-title">Upload a Profile Photo</h2>
  <form action="" class="max-w-streen-md w-full">
    <div class="form-control w-full max-w-xs my-10 mx-auto text-center">
      <img
        src={previewURL ?? $userData?.photoURL ?? "/user.png"}
        alt="photoURL"
        width="256"
        height="256"
        class="mx-auto"
      />
      <label for="photoURL" class="label">
        <span class="label-text">Pick a file</span>
      </label>
      <input
        on:change={upload}
        name="photoURL"
        type="file"
        class="file-input file-input-bordered w-full max-w-xs"
        accept="image/png, image/jpeg. image/gif, image/webp"
      />
      {#if uploading}
        <p>Uploading...</p>
        <progress class="progress progress-info w-56 mt-6" />
      {/if}
    </div>
  </form>
</AuthCheck>
