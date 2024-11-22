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

    async function askChatGPT() {
        let userQuestion = document.getElementById("userInput").value.trim();
      
        if (!userQuestion) {
          document.getElementById("response").innerText = "Please enter a valid question.";
          return;
        }
      
        // Append system-level instructions to restrict the bot's behavior
        userQuestion += ` You are an experienced GATE teacher. Respond strictly to educational or study-related queries. If the question is off-topic or unrelated to education, reply with: "Please ask something related to studies." Do not provide irrelevant or inappropriate information.`;
      
        const payload = {
          model: "gpt-4-turbo-preview",
          messages: [
            {
              role: "system",
              content: "You are a GATE teacher specializing in engineering subjects. Only answer questions related to studies or educational topics.",
            },
            {
              role: "user",
              content: userQuestion,
            },
          ],
          max_tokens: 200,
          temperature: 0.7, // Adjusted for more focused responses
        };
      
        try {
          const response = await fetch(
            "https://cheapest-gpt-4-turbo-gpt-4-vision-chatgpt-openai-ai-api.p.rapidapi.com/v1/chat/completions",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "X-RapidAPI-Key": "3d9d230ab8mshb82d62d1db3fafap152239jsn2afb51b9ab40", // Replace with your API key
                "X-RapidAPI-Host": "cheapest-gpt-4-turbo-gpt-4-vision-chatgpt-openai-ai-api.p.rapidapi.com",
              },
              body: JSON.stringify(payload),
            }
          );
      
          if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
          }
      
          const data = await response.json();
          const botResponse = data.choices[0].message.content.trim();
      
          if (botResponse.toLowerCase().includes("please ask something related to studies")) {
            document.getElementById("response").innerText = botResponse;
          } else {
            document.getElementById("response").innerText = botResponse;
          }
        } catch (error) {
          document.getElementById("response").innerText = "Error: " + error.message;
        }
      }
      