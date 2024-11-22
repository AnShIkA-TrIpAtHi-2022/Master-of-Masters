
function startDailyChallenge() {
    window.location.href = "./quizz/index.html";
}

function startTest(difficulty) {
    window.location.href = "./quizz/index.html";
}

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
          temperature: 0.7, 
        };
      
        try {
          const response = await fetch(
            "api-key",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "X-RapidAPI-Key": "api-key", // Replace with your API key
                "X-RapidAPI-Host": "api-key",
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
      