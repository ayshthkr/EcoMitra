"use server";

import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { Message } from "ai";

// Interface for saving a chat
interface SaveChatInput {
  id: string;
  messages: Message[];
  userId: string;
}

/**
 * Retrieves a chat by ID, ensuring the user has access
 */
export async function getChatById(chatId: string) {
  try {
    const { userId } = await auth();

    if (!userId) {
      throw new Error("Unauthorized: No user found");
    }

    const chat = await prisma.chat.findUnique({
      where: {
        id: chatId,
        userId, // Ensures user can only access their own chats
      },
      include: {
        messages: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    if (!chat) {
      return null;
    }

    // Transform to expected Message format
    const messages = chat.messages.map((msg) => ({
      id: msg.id,
      role: msg.role,
      content: msg.content,
    }));

    return {
      id: chat.id,
      messages,
    };
  } catch (error) {
    console.error("Error fetching chat:", error);
    return null;
  }
}

/**
 * Saves or updates a chat with its messages
 */
export async function saveChat(input: SaveChatInput) {
  try {
    const { id, messages, userId } = input;

    // Upsert the chat record
    await prisma.chat.upsert({
      where: { id },
      update: { updatedAt: new Date() },
      create: {
        id,
        userId,
      },
    });

    // Delete existing messages if this is an update
    await prisma.chatMessage.deleteMany({
      where: { chatId: id },
    });

    // Create new message records
    await prisma.chatMessage.createMany({
      data: messages.map((message) => ({
        chatId: id,
        role: message.role,
        content: message.content,
      })),
    });

    return { success: true };
  } catch (error) {
    console.error("Error saving chat:", error);
    throw error;
  }
}
