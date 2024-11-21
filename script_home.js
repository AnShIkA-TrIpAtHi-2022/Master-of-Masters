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
    window.location.href = "quiz.html?questions=5&difficulty=random";
}

function startTest(difficulty) {
    window.location.href = `quiz.html?questions=20&difficulty=${difficulty}`;
}
