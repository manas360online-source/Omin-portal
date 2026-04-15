import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Simple in-memory cache to reduce API calls
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 1000 * 60 * 30; // 30 minutes

async function withRetry<T>(fn: () => Promise<T>, maxRetries = 5): Promise<T> {
  let lastError: any;
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;
      
      // Robust rate limit detection
      const errorMsg = String(error?.message || "").toLowerCase();
      const errorStatus = String(error?.status || "").toLowerCase();
      const errorCode = error?.code || error?.error?.code;
      const errorBody = JSON.stringify(error).toLowerCase();
      
      const isRateLimit = 
        errorCode === 429 || 
        errorStatus === "resource_exhausted" ||
        errorMsg.includes("429") || 
        errorMsg.includes("quota") ||
        errorMsg.includes("limit") ||
        errorMsg.includes("resource_exhausted") ||
        errorBody.includes("429") ||
        errorBody.includes("resource_exhausted");
      
      if (isRateLimit && i < maxRetries - 1) {
        // Longer delay for rate limits: 2s, 4s, 8s, 16s, 32s
        const delay = Math.pow(2, i + 1) * 1000 + Math.random() * 1000;
        console.warn(`Rate limit hit, retrying in ${delay.toFixed(0)}ms... (Attempt ${i + 1}/${maxRetries})`);
        await sleep(delay);
        continue;
      }
      throw error;
    }
  }
  throw lastError;
}

export const getGeminiModel = (model = "gemini-3-flash-preview") => {
  return ai.models.generateContent.bind(ai.models);
};

export const getNearbyPlaces = async (lat: number, lng: number, query: string) => {
  const cacheKey = `places-${lat.toFixed(4)}-${lng.toFixed(4)}-${query}`;
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    console.log("Returning cached places for:", query);
    return cached.data;
  }

  const getMockData = () => {
    console.warn("Quota exhausted or rate limit hit after retries, returning mock hospitals for demo purposes.");
    return [
      {
        name: "City General Hospital (Demo)",
        description: "A leading multi-specialty hospital providing comprehensive healthcare services with state-of-the-art facilities.",
        category: "Hospital",
        latitude: lat + 0.005,
        longitude: lng + 0.005,
        uri: `https://www.google.com/maps/search/hospital/@${lat},${lng},14z`
      },
      {
        name: "St. Mary's Medical Center (Demo)",
        description: "Specialized care in cardiology, oncology, and emergency medicine. Open 24/7 for all patients.",
        category: "Medical Center",
        latitude: lat - 0.008,
        longitude: lng + 0.01,
        uri: `https://www.google.com/maps/search/hospital/@${lat},${lng},14z`
      },
      {
        name: "Community Health Clinic (Demo)",
        description: "Providing affordable primary care, vaccinations, and wellness checkups for the local community.",
        category: "Clinic",
        latitude: lat + 0.012,
        longitude: lng - 0.005,
        uri: `https://www.google.com/maps/search/clinic/@${lat},${lng},14z`
      }
    ];
  };

  try {
    return await withRetry(async () => {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Find all ${query} near latitude ${lat}, longitude ${lng}. Provide a comprehensive list of at least 10 nearby locations if available. Include their names, detailed descriptions, and categories.`,
        config: {
          tools: [{ googleMaps: {} }],
          toolConfig: {
            retrievalConfig: {
              latLng: {
                latitude: lat,
                longitude: lng
              }
            }
          }
        },
      });

      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      
      // Extract places from grounding chunks
      const places = chunks.map((chunk: any) => {
        if (chunk.maps) {
          return {
            name: chunk.maps.title || "Unknown Place",
            description: chunk.maps.description || "No description available.",
            category: query,
            latitude: chunk.maps.latLng?.latitude,
            longitude: chunk.maps.latLng?.longitude,
            uri: chunk.maps.uri
          };
        }
        return null;
      }).filter(Boolean);

      if (places.length === 0 && response.text) {
        const result = [{
          name: "Search Results",
          description: response.text,
          category: query
        }];
        cache.set(cacheKey, { data: result, timestamp: Date.now() });
        return result;
      }

      cache.set(cacheKey, { data: places, timestamp: Date.now() });
      return places;
    });
  } catch (e: any) {
    console.error("Failed to fetch nearby places after retries", e);
    return getMockData();
  }
};

export const getHealthAdvice = async (topic: string) => {
  const cacheKey = `advice-${topic}`;
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) return cached.data;

  try {
    return await withRetry(async () => {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Provide comprehensive health tips, diet recommendations, and precautions for: ${topic}. Include day-to-day life tips.`,
      });
      const result = response.text;
      cache.set(cacheKey, { data: result, timestamp: Date.now() });
      return result;
    });
  } catch (e) {
    console.error("Health advice failed:", e);
    return "Maintain a balanced diet, stay hydrated, and exercise regularly. Consult a doctor for specific medical concerns.";
  }
};

export const getMedicalCosts = async (operation: string) => {
  const cacheKey = `costs-${operation}`;
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) return cached.data;

  try {
    return await withRetry(async () => {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Estimate the average cost of ${operation} in major hospitals. Provide a breakdown of costs if possible. Format as JSON with fields: operationName, averagePrice, range (min-max), and notes.`,
        config: {
          responseMimeType: "application/json"
        }
      });
      const result = JSON.parse(response.text || "{}");
      cache.set(cacheKey, { data: result, timestamp: Date.now() });
      return result;
    });
  } catch (e) {
    console.error("Medical costs failed:", e);
    return {
      operationName: operation,
      averagePrice: "Varies",
      range: "Contact local hospital",
      notes: "Costs vary significantly by region and facility."
    };
  }
};

export const getHealthNews = async () => {
  const cacheKey = `news-latest`;
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) return cached.data;

  try {
    return await withRetry(async () => {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: "What are the top 5 latest health news stories, medical breakthroughs, or wellness updates today? Provide a title, a short summary, a source URL, and an image URL (if available) for each. Format as a JSON array of objects with fields: title, summary, url, category, imageUrl.",
        config: {
          tools: [{ googleSearch: {} }],
          responseMimeType: "application/json"
        },
      });
      const result = JSON.parse(response.text || "[]");
      cache.set(cacheKey, { data: result, timestamp: Date.now() });
      return result;
    });
  } catch (e) {
    console.error("Failed to fetch health news after retries", e);
    return [
      {
        title: "Breakthrough in Diabetes Research (Demo)",
        summary: "New clinical trials show promising results for a once-weekly insulin injection that could replace daily shots for millions.",
        url: "https://www.who.int",
        category: "Research",
        imageUrl: "https://picsum.photos/seed/diabetes/800/400"
      },
      {
        title: "Global Wellness Trends 2026 (Demo)",
        summary: "Mental health integration and personalized nutrition are topping the charts as the most impactful wellness shifts this year.",
        url: "https://www.healthline.com",
        category: "Wellness",
        imageUrl: "https://picsum.photos/seed/wellness/800/400"
      }
    ];
  }
};

export const generateHealthImage = async (prompt: string) => {
  try {
    return await withRetry(async () => {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            {
              text: `A high-quality, professional medical or science photography related to: ${prompt}. Cinematic lighting, clean composition, 8k resolution.`,
            },
          ],
        },
        config: {
          imageConfig: {
            aspectRatio: "16:9",
          },
        },
      });

      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
      return null;
    });
  } catch (e) {
    console.error("AI Image generation failed after retries:", e);
    return null;
  }
};
