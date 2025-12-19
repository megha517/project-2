
import { GoogleGenAI, Type } from "@google/genai";
import { ClassificationResult, ClassificationType } from "../types";

export const classifyEmail = async (content: string): Promise<ClassificationResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Classify the following email text as SPAM, PHISHING, or LEGITIMATE. Provide a detailed breakdown of its features.\n\nEmail Content:\n${content}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          classification: {
            type: Type.STRING,
            description: "The category: SPAM, PHISHING, or LEGITIMATE",
          },
          confidence: {
            type: Type.NUMBER,
            description: "Confidence score between 0 and 1",
          },
          reasoning: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Bullet points explaining the decision",
          },
          features: {
            type: Type.OBJECT,
            properties: {
              urgencyLevel: { type: Type.NUMBER, description: "Scale 0-10 of how urgent the tone is" },
              suspiciousLinks: { type: Type.BOOLEAN, description: "Presence of unusual URLs" },
              grammarQuality: { type: Type.NUMBER, description: "Scale 0-10 of linguistic correctness" },
              financialPromises: { type: Type.BOOLEAN, description: "Presence of 'get rich quick' or 'unclaimed money' themes" },
              senderAnonymity: { type: Type.NUMBER, description: "Scale 0-10 of how obscured the sender seems" },
            },
            required: ["urgencyLevel", "suspiciousLinks", "grammarQuality", "financialPromises", "senderAnonymity"],
          },
        },
        required: ["classification", "confidence", "reasoning", "features"],
      },
    },
  });

  const rawJson = JSON.parse(response.text);
  
  return {
    id: crypto.randomUUID(),
    timestamp: Date.now(),
    content,
    classification: rawJson.classification as ClassificationType,
    confidence: rawJson.confidence,
    reasoning: rawJson.reasoning,
    features: rawJson.features,
  };
};
