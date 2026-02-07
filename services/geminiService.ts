
import { GoogleGenAI } from "@google/genai";
import { AIAdviceRequest } from "../types";

export const getToyAdvice = async (request: AIAdviceRequest): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `Siz ToyMix do'konining aqlli yordamchisiz. Ota-onaga quyidagi ma'lumotlar asosida farzandi uchun o'yinchoq tanlashda yordam bering:
  - Bolaning yoshi: ${request.age}
  - Qiziqishlari: ${request.interest}
  - Budjet (taxminan): ${request.budget}

  Iltimos, o'yinchoq turini, uning foydali jihatlarini va nega aynan shu yoshga mosligini tushuntirib bering. Javobni o'zbek tilida, do'stona va bolalarga g'amxo'rlik ruhida yozing. Faqat matnli maslahat bering, narxlarni aniq aytishingiz shart emas.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        temperature: 0.7,
        topP: 0.9,
      }
    });

    return response.text || "Kechirasiz, hozirda maslahat bera olmayman. Iltimos, birozdan so'ng urinib ko'ring.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Tizimda xatolik yuz berdi. Iltimos, internet aloqasini tekshiring.";
  }
};
