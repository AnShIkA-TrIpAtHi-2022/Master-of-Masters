import { Clerk } from "@clerk/clerk-js";

(async () => {
  const clerk = new Clerk();
  await clerk.load(); // Ensure Clerk is properly initialized

  // Attach the logout functionality to the button
  document.getElementById("logout").addEventListener("click", async (e) => {
    e.preventDefault(); // Prevent any default behavior of <a> tag

    try {
      await clerk.signOut(); // Sign out the user
      alert("Successfully logged out!"); // Optional success message
      // Redirect the user to the login page or another location
      window.location.href = "/login"; // Adjust the path as per your app
    } catch (error) {
      console.error("Error during logout:", error);
      alert("Failed to log out. Please try again.");
    }
  });
})();
