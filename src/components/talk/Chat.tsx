"use client"
import React, { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { useEffect } from "react";

function systemPrompt(user:any) {
  return "your finacial advisor,  give me a summary of the user and their financial situation, and then ask them how you can help them today and provide help by looking at portfolio and give proper advise according . \n\n" +
    "user: " + JSON.stringify(user) + "\n"
    +"username "+ user?.name + "\n" ;

}


const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY as string);

const replyFromAi = async (user:any ,message: string) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    let prompt = `${message} `;

 
      prompt += ` ${systemPrompt(user)}`;
    

    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("AI response error:", error);
    return "Sorry, I couldn't process your request at the moment.";
  }
};

const Chat = ({ user }:{user:any}) => {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>(
    []
  );
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
useEffect(() => {
    const greetUser = async () => {
      const greeting = await replyFromAi(user, "");
      setMessages([{ role: "ai", content: greeting }]);
    };
    greetUser();
  }, [user]);
  const sendMessage = async () => {
    if (!input.trim()) return;
    setLoading(true);

    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");

    try {
      const response = await replyFromAi(user, input);
      setMessages([...newMessages, { role: "ai", content: response }]);
    } catch (error) {
      console.error("Error generating response:", error);
    }

    setLoading(false);
  };

  return (
    <div className="w-full mx-auto p-4 border rounded-lg shadow-lg h-full text-black">
      <h1 className="text-xl font-bold mb-4">Chat with AI</h1>
      <div className=" overflow-y-auto border p-2 rounded">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-2 my-1 rounded ${
              msg.role === "user"
                ? "bg-slate-200 text-right"
                : "bg-gray-200 text-left"
            }`}
          >
            {msg.content}
          </div>
        ))}
      </div>
      <div className="flex mt-4">
        <input
          type="text"
          className="flex-1 border p-2 rounded"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          className="ml-2 bg-black text-white px-4 py-2 rounded"
        >
          {loading ? "..." : "Send"}
        </button>
      </div>
    </div>
  );
};

export default Chat;
