import { Clerk } from "@clerk/clerk-js";

(async () => {
  const clerk = new Clerk();
  await clerk.load();

  document.getElementById("logout").addEventListener("click", async (e) => {
    e.preventDefault(); 

    try {
      await clerk.signOut(); 
      alert("Successfully logged out!"); 
      window.location.href = "/login"; 
    } catch (error) {
      console.error("Error during logout:", error);
      alert("Failed to log out. Please try again.");
    }
  });
})();
