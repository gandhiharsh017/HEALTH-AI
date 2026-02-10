
import { GoogleGenAI } from "@google/genai";
import { UserStats } from "../types";

export const getHealthAdvice = async (stats: UserStats, query: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const systemInstruction = `
    You are Health AI, a world-class health and fitness coach. 
    The user's current daily stats are:
    - Steps: ${stats.steps}
    - Water: ${stats.waterIntake}ml
    - Calories Burned: ${stats.caloriesBurned}
    - Heart Rate: ${stats.heartRate}bpm
    - Distance: ${stats.distance}km
    - Sleep: ${stats.sleepHours} hours

    Provide actionable, encouraging, and science-backed health advice based on these metrics. 
    Keep responses concise, empathetic, and professional.
    If the user asks medical questions, remind them you are an AI assistant and they should consult a doctor for serious concerns.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: query,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    return response.text || "I'm sorry, I couldn't generate advice right now.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "The AI coach is currently taking a break. Please try again in a moment.";
  }
};
