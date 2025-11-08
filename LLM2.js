import { GoogleGenAI } from "@google/genai";
import readlineSync from "readline-sync";

// The client gets the API key from the environment variable `GEMINI_API_KEY`.
const ai = new GoogleGenAI({apiKey : "AIzaSyCoBogDH4HWvkm-qOClpnmKPTO8_q7DgLk"});


const chat = ai.chats.create({
    model: "gemini-2.5-flash",
    history: [],
})


async function main() {
    const userQuery = readlineSync.question("ask me ");
    const response1 = await chat.sendMessage({message : userQuery});
    console.log(response1.text);
  
    main();
}

main();

