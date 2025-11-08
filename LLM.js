// AIzaSyCoBogDH4HWvkm-qOClpnmKPTO8_q7DgLk
import { GoogleGenAI } from "@google/genai";
import readlineSync from "readline-sync";

// The client gets the API key from the environment variable `GEMINI_API_KEY`.
const ai = new GoogleGenAI({apiKey : "AIzaSyCoBogDH4HWvkm-qOClpnmKPTO8_q7DgLk"});

const history = [];
const chatting =async(userQuery)=>{
    history.push({role :"user" , parts : [{text : userQuery}]});
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: history,
    });

    history.push({role : "model" , parts : [{text : response.text}]});
  console.log("\n");
  
  console.log(response.text);
}

async function main() {
  const userQuery =readlineSync.question("How can i help you ? ") ;
  await chatting(userQuery);
  main();
}

main();

