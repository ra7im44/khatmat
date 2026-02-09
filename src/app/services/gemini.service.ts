import { Injectable } from '@angular/core';
import { GoogleGenAI, GenerateContentResponse } from '@google/genai';

const GEMINI_API_KEY = 'AIzaSyD-q_KIuM7Jhipw67rDBb1x91d3YGaQJ0c';

@Injectable({
  providedIn: 'root'
})
export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
  }

  async analyzeRecitation(audioBase64: string, expectedText: string): Promise<any> {
    const prompt = `
      أنت معلم قرآن كريم خبير. سأرسل لك تسجيلاً صوتياً لتلاوة آية، والنص الصحيح لهذه الآية.
      مهمتك:
      1. تحويل الصوت إلى نص (Transcription).
      2. مقارنة النص المنطوق بالنص الصحيح بدقة.
      3. تحديد الأخطاء (نطق خاطئ، كلمة ناقصة، كلمة زائدة، حركات إعرابية خاطئة إن أمكن سماعها).
      4. إعطاء تقييم من 100.
      5. تقديم نصيحة للتحسين.

      النص الصحيح المتوقع: "${expectedText}"

      أخرج النتيجة بصيغة JSON فقط بهذا الشكل:
      {
        "transcription": "النص الذي سمعته",
        "score": 85,
        "mistakes": [
          {"type": "missing", "word": "الكلمة", "description": "نسيت قراءة كلمة ..."},
          {"type": "pronunciation", "word": "الكلمة", "description": "نطقت الحرف كذا بدلاً من كذا"}
        ],
        "feedback": "نصيحة عامة"
      }
    `;

    try {
      const response: GenerateContentResponse = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: {
          role: 'user',
          parts: [
            { text: prompt },
            {
              inlineData: {
                mimeType: 'audio/webm',
                data: audioBase64
              }
            }
          ]
        },
        config: {
          responseMimeType: 'application/json',
        }
      });

      const text = response.text || '{}';
      return JSON.parse(text);
    } catch (error) {
      console.error('Gemini API Error:', error);
      throw error;
    }
  }
}