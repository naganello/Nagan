import { GoogleGenAI, Type } from "@google/genai";
import { AIPlanRequest, AIPlanResponse } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateWorkoutPlan = async (request: AIPlanRequest): Promise<AIPlanResponse> => {
  const modelId = "gemini-2.5-flash"; // Excellent for structured JSON tasks

  const prompt = `
    Sei un personal trainer esperto. Crea un piano di allenamento dettagliato basato sui seguenti parametri utente:
    - Obiettivo: ${request.goal}
    - Livello: ${request.level}
    - Giorni a settimana: ${request.daysPerWeek}
    - Attrezzatura disponibile: ${request.equipment}

    Restituisci il risultato STRETTAMENTE in formato JSON seguendo lo schema richiesto.
    Il piano deve essere pratico, sicuro e progressivo. Usa l'italiano per tutti i testi.
  `;

  // Define the schema for structured output
  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      planName: { type: Type.STRING, description: "Un nome accattivante per il piano" },
      description: { type: Type.STRING, description: "Breve descrizione del focus del piano" },
      schedule: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            dayName: { type: Type.STRING, description: "Es. Lunedì - Petto/Tricipiti o Giorno 1" },
            focus: { type: Type.STRING, description: "Gruppo muscolare o tipo di allenamento" },
            exercises: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  sets: { type: Type.STRING, description: "Numero di serie, es: '3-4'" },
                  reps: { type: Type.STRING, description: "Range di ripetizioni, es: '8-12'" },
                  notes: { type: Type.STRING, description: "Consigli tecnici o di recupero" }
                },
                required: ["name", "sets", "reps"]
              }
            }
          },
          required: ["dayName", "focus", "exercises"]
        }
      }
    },
    required: ["planName", "description", "schedule"]
  };

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.7
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as AIPlanResponse;
    } else {
      throw new Error("Nessun testo generato dal modello.");
    }
  } catch (error) {
    console.error("Errore durante la generazione del piano:", error);
    throw error;
  }
};