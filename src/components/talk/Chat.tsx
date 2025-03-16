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
    <div className="w-full h-full mx-auto p-4 border rounded-lg shadow-lg h-[600px] flex flex-col bg-white">
    {/* Header */}
    <h1 className="text-xl text-left font-bold mb-4  border-b pb-2">Chat with AI</h1>
  
    {/* Chat Messages (Scrollable Area) */}
    <div className="flex-1 overflow-y-auto p-4 space-y-2 border rounded bg-gray-100">
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`p-3 rounded-lg max-w-[75%] ${
            msg.role === "user"
              ? "bg-slate-200 text-white self-end ml-auto"
              : "bg-gray-300 text-black self-start mr-auto"
          }`}
        >
          {msg.content}
        </div>
      ))}
    </div>
  
    {/* Input Box (Sticks to Bottom) */}
    <div className="border-t p-3 bg-white flex items-center">
      <input
        type="text"
        className="flex-1 border p-2 rounded-lg text-black outline-none"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type a message..."
      />
      <button
        onClick={sendMessage}
        disabled={loading}
        className="ml-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
      >
        {loading ? "..." : "Send"}
      </button>
    </div>
  </div>
  
  );
};

export default Chat;
