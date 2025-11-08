const GEMINI_API_KEY = "AIzaSyCH3nz3HYtHmDnlBeR3Xh1Hr-crqf12tGc";

const systemInstruction = "System Role: You are a warm, empathetic, and insightful Relationship Advisor Chatbot.Your Goal: Help users navigate their romantic or personal relationships by offering understanding, supportive, and constructive advice. You should only talk about relationship-related topics — including love, trust, communication, heartbreak, emotional connection, dating tips, conflict resolution, setting boundaries, and building healthy relationships. Tone and Style Guidelines:Be empathetic, non-judgmental, and encouraging.Use simple, clear, and relatable language — as if you’re a friendly counselor or mentor.Use emojis naturally to express emotion and make the advice more engaging (e.g., 💬❤️🙂💔✨).Always validate the user’s feelings before offering advice.Provide practical, emotionally intelligent suggestions that promote healthy communication and respect.Keep the responses positive and supportive, even in difficult situations.Topic Restriction:Do not give advice outside the scope of relationships (e.g., finance, career, health, coding, etc.).do not provide explicit adult or sexual content.If a user asks something unrelated, gently guide them back to relationship topics.Example: “That’s an interesting question! But since I focus only on relationship guidance ❤️, could you tell me what’s happening between you and this person?”Behavior Examples:If the user is heartbroken → comfort them, validate their pain, and give gentle emotional healing advice 💔🌱.If the user is trying to impress someone → suggest healthy ways to build connection and communication 😊💬.If the user is in conflict → suggest ways to listen, empathize, and communicate respectfully 🕊️.End Goal: Help the user feel understood, emotionally supported, and guided toward better relationship health and happiness. ❤️ try to keep the answer concise , dont just stop after giving response try to ask some question from them to solve the user problem completely .";

const history = [];
async function ChattingWithGemini(userProblem) {
    if(!GEMINI_API_KEY){
        return "I can't answer your query as my API setting is not correctly set up";
    }
    // add the user problem to history
    history.push({role : "user" ,parts : [{text : userProblem}] });

    //hitting end point
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

    const requestBody = {
        contents: history, // Send the current chat history
        systemInstruction: { // Define the persona/behavior for the model
            parts: [{ text: systemInstruction }]
        },
        generationConfig: {
            temperature: 0.8, // Adjust for more creative/varied responses
            maxOutputTokens: 800, // Max length of the response
        },
        safetySettings: [ // Optional: Adjust safety settings if needed
            { "category": "HARM_CATEGORY_HARASSMENT", "threshold": "BLOCK_MEDIUM_AND_ABOVE" },
            { "category": "HARM_CATEGORY_HATE_SPEECH", "threshold": "BLOCK_MEDIUM_AND_ABOVE" },
            { "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT", "threshold": "BLOCK_MEDIUM_AND_ABOVE" },
            { "category": "HARM_CATEGORY_DANGEROUS_CONTENT", "threshold": "BLOCK_MEDIUM_AND_ABOVE" }
        ]
    }

    try {
        const response = await fetch(apiUrl , {
            method : "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body : JSON.stringify(requestBody)
        });

        const responseData = await response.json();
        console.log(responseData);
        
        if (!response.ok) {
            console.error("API Error Response:", responseData);
            const errorMessage = responseData.error?.message || `API request failed with status ${response.status}`;
            // Add error to history so it doesn't break the flow
            history.push({
                role: 'model',
                parts: [{ text: `API Error: ${errorMessage}` }]
            });
            return `Oh no, something went wrong 🥺 (${errorMessage}). Check console for details.`;
        }
        let botResponseText = "Sorry I am unable to process the information correctly right now , can we discuss something else ? ";

        if(responseData.candidates[0]?.content?.parts[0]?.text){
            botResponseText = responseData.candidates[0]?.content?.parts[0]?.text;
        } else if (responseData.promptFeedback && responseData.promptFeedback.blockReason) {
            botResponseText = `I am really sorry I cannot response to this ${responseData.promptFeedback.blockReason}. you can take advice on relationships.`;
            console.warn("Prompt blocked:", responseData.promptFeedback);
        } else {
            console.warn("Unexpected API response structure:", responseData);
        }

        return botResponseText;

    } catch (error) {
        return "oops! error is here"
    }

}

export default ChattingWithGemini;