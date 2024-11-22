// import { Clerk } from '@clerk/clerk-js'

// const pubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

// const clerk = new Clerk(pubKey)
// await clerk.load()

// if (clerk.user) {
//   document.getElementById('logout').addEventListener('click', async () => {
//     await clerk.signOut()
//     window.location.reload();
//   })
// }

function startDailyChallenge() {
    window.location.href = "./quizz/index.html";
}

function startTest(difficulty) {
    window.location.href = "./quizz/index.html";
}

    // Toggle chatbot visibility
    function toggleChatbot() {
      const chatbotPopup = document.getElementById("chatbotPopup");
      chatbotPopup.style.display = chatbotPopup.style.display === "flex" ? "none" : "flex";
    }