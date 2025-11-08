import { Type } from "@google/genai";
import { GoogleGenAI } from "@google/genai";
import readlineSync from 'readline-sync'

// function for sum of two numbers
const sum =({n1 , n2})=>{
    return n1+n2;
}

// function to get crypto price
const getCryptoPrice=async({coin})=>{
    const response = await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${coin}`)
    const data = await response.json();

    return data;
}
// function tell a number is prime or not
const prime=({num})=>{
    if(num<2)
        return false;

    for(let i=2;i<=Math.sqrt(num);i++)
        if(num%i==0) return false

    return true;
}

// now we have to give disription of each function so that LLM can understand which function to use and when to use 
const sumDeclaration={
    name : "sum",
    description : "get the sum of two numbers",
    parameters : {
        // type : 'OBJECT', this is also fine
        type : Type.OBJECT,

        properties: {
            n1: {
                type: Type.INTEGER,
                description: 'it is the first number for addition',
            },
            n2: {
                type: Type.INTEGER,
                description: 'it is the second number for addition',
            }
        },
        required: ['n1' , 'n2'],
    },
}
const primeDeclaration={
    name : "prime",
    description : "Get if number if prime or not",
    parameters : {
        // type : 'OBJECT', this is also fine
        type : Type.OBJECT,

        properties: {
            n1: {
                type: Type.INTEGER,
                description: 'It will be the number to find it is prime or not',
            }
            
        },
        required: ['n1'],
    },
}
const cryptoDeclaration={
    name : "getCryptoPrice",
    description : "this function get the current prise of crypto",
    parameters : {
        // type : 'OBJECT', this is also fine
        type : Type.OBJECT,

        properties: {
            coin: {
                type: Type.STRING,
                description: 'It will be the crypto currency name, like bitcoin',
            },
            
        },
        required: ['coin'],
    },
}

// now we will pass the object of all the tool/function we have to allow access to our LLM
const availableTools = {
    sum : sum,
    prime : prime,
    getCryptoPrice : getCryptoPrice
}

// now we will create a function that will allow or tell the LLM when to use and how to use our tool
const API = "AIzaSyCoBogDH4HWvkm-qOClpnmKPTO8_q7DgLk";
const ai  = new GoogleGenAI({apiKey : API});

const history = [];
const runAgent = async(userProblem)=>{
    history.push({role : "user" , parts:[{text : userProblem}]});
 while(true){
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: history,
        config: {
            systemInstruction: `You are an AI Agent, You have access of 3 available tools like to
            to find sum of 2 number, get crypto price of any currency and find a number is prime or not
            
            Use these tools whenever required to confirm user query.
            If user ask general question you can answer it directly if you don't need help of these three tools`,
            tools: [{
            functionDeclarations: [sumDeclaration , primeDeclaration , cryptoDeclaration]
            }],
        }
    });

   
        if (response.functionCalls && response.functionCalls.length > 0) {

        console.log(response.functionCalls);
      
        const{name , args} = response.functionCalls[0];
        const funcCall = availableTools[name];
        console.log(name , "function called by LLM");
        
        const result = await funcCall(args);

        // updating history
        history.push({role : "model" , parts : [{functionCall : response.functionCalls[0]}]});
        const functionResponsePart = {
            name: name,
            response: {
                result: result,
            },
        };
        history.push({role : "user" , parts : [{functionResponse : functionResponsePart}]})

        } else {
            console.log("No function call found in the response.");
            console.log(response.text);
            history.push({role : "model" , parts : [{text : response.text}]});
            break;
        }
    }
    
}

const main =async()=>{
    const userProblem = readlineSync.question("ask me something ? ");
    await runAgent(userProblem);
    main();
}
main();