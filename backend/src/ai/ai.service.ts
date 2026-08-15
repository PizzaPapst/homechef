import { Injectable, Logger } from '@nestjs/common';
import OpenAI from 'openai';
import { SEARCHABLE_BASE_INGREDIENTS, INGREDIENT_BLACKLIST } from '../recipes/ingredient-config';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private openai: OpenAI | null = null;
  private readonly DASHSCOPE_KEY = process.env.DASHSCOPE_API_KEY;
  private readonly OLLAMA_URL =
    process.env.OLLAMA_URL || 'http://localhost:11434/api/generate';

  constructor() {
    if (this.DASHSCOPE_KEY) {
      this.logger.log(
        `✅ DashScope (Qwen) API Key gefunden! (Startet mit: ${this.DASHSCOPE_KEY.substring(0, 8)}...)`,
      );
      this.openai = new OpenAI({
        apiKey: this.DASHSCOPE_KEY,
        baseURL: 'https://dashscope-intl.aliyuncs.com/compatible-mode/v1',
      });
    } else {
      this.logger.warn(
        '❌ Kein DashScope API Key gefunden. Nutze Fallback auf Ollama.',
      );
    }
  }

  async parseRecipeFromSocialMedia(
    metadata: { title: string; description: string },
    transcript: string | null,
  ): Promise<any> {
    const transcriptSection = transcript
      ? `\n        Gesprochener Videoinhalt (Whisper-Transkript):\n        ${transcript.substring(0, 8000)}`
      : '';

    const prompt = `
        Du bist ein Experte für Rezept-Analyse. Extrahiere strukturierte Rezeptdaten.
        Antworte NUR mit validem JSON ohne Markdown-Formatierung.

        Gewünschte JSON-Struktur:
        {
          "name": "Name des Gerichts",
          "description": "Kurze Beschreibung des Gerichts in 1-2 Sätzen",
          "recipeYield": 4,
          "prepTime": "PT30M",
          "recipeIngredient": [
            "500 g Mehl",
            "280 ml lauwarmes Wasser",
            "1/2 Würfel frische Hefe",
            "3 EL Olivenöl"
          ],
          "recipeInstructions": [
            "Schritt 1: Mehl in eine Schüssel geben...",
            "Schritt 2: Hefe im Wasser auflösen..."
          ]
        }

        WICHTIGE REGELN:
        - recipeIngredient: IMMER als Array von STRINGS im Format "Menge Einheit Zutat"
        - recipeInstructions: IMMER als Array von STRINGS mit vollständigen Schritten
        - prepTime: Im ISO-8601 Format (z.B. "PT30M" = 30 Minuten)
        - Falls Infos fehlen: sinnvolle Defaults verwenden (recipeYield: 4, prepTime: "PT30M")
        - Nutze ALLE verfügbaren Quellen (Beschreibung + Transkript falls vorhanden)

        Videotitel: ${metadata.title}
        Videobeschreibung:
        ${metadata.description}${transcriptSection}
      `;

    return this.askAI(prompt);
  }

  async parseRecipeFromHtml(textContext: string): Promise<any> {
    const cleanText = textContext.replace(/\s+/g, ' ').substring(0, 15000);
    const prompt = `
        Du bist ein Experte für Rezept-Analyse. Extrahiere strukturierte Daten aus dem Text.
        Antworte NUR mit validem JSON.
        
        Struktur:
        {
          "name": "Gericht Name",
          "recipeYield": 4,
          "prepTime": "PT30M", 
          "recipeIngredient": [
            { "name": "500g Kartoffeln, festkochend", "base_ingredient": "Kartoffel" },
            { "name": "Prise Salz", "base_ingredient": null }
          ],
          "recipeInstructions": ["Schritt 1", "Schritt 2"]
        }
        
        REGELN für "base_ingredient":
        1. Nutze ausschließlich Begriffe aus dieser Liste (oder null): [${SEARCHABLE_BASE_INGREDIENTS.join(", ")}]
        2. Ignoriere (null setzen) alle Zutaten aus dieser Liste: [${INGREDIENT_BLACKLIST.join(", ")}]
        3. Synonyme/Varianten MÜSSEN auf Begriffe der Liste gemappt werden.
        4. Nutze immer den Singular (Einzahl).
        
        Text:
        ${cleanText}
      `;

    return this.askAI(prompt);
  }

  async categorizeIngredients(ingredients: string[]): Promise<{ name: string; base_ingredient: string | null }[] | null> {
    if (!ingredients || ingredients.length === 0) return null;

    const prompt = `
      Analysiere diese Liste von Zutaten und ordne jeder Zutat eine "base_ingredient" zu.
      Antworte NUR mit validem JSON in diesem Format:
      [
        { "name": "Zwiebeln, gewürfelt", "base_ingredient": "Zwiebel" },
        { "name": "Salz", "base_ingredient": null }
      ]

      REGELN:
      1. Nutze ausschließlich Begriffe aus dieser Liste (oder null): [${SEARCHABLE_BASE_INGREDIENTS.join(", ")}]
      2. Ignoriere (null setzen) alle Zutaten aus dieser Liste: [${INGREDIENT_BLACKLIST.join(", ")}]
      3. Synonyme/Varianten MÜSSEN auf Begriffe der Liste gemappt werden.
      4. Nutze immer den Singular (Einzahl).

      Zutaten-Liste:
      ${ingredients.join('\n')}
    `;

    try {
      return await this.askAI(prompt);
    } catch (e) {
      return null;
    }
  }

  private async askAI(prompt: string): Promise<any> {
    // 1. Primär: qwen3.7-flash, 2. Fallback: qwen3.6-flash
    const qwenModels = ['qwen3.7-flash', 'qwen3.6-flash'];

    if (this.openai) {
      for (const model of qwenModels) {
        try {
          return await this.askQwen(prompt, model);
        } catch (err: any) {
          this.logger.warn(`Modell ${model} fehlgeschlagen: ${err?.message} → Versuche nächstes Modell...`);
        }
      }
    }

    // 3. Fallback: Ollama
    return await this.askOllama(prompt);
  }

  private async askQwen(prompt: string, model: string = 'qwen3.7-flash'): Promise<any> {
    this.logger.log(`Nutze Modell: ${model} (DashScope)`);
    if (!this.openai) throw new Error('OpenAI Client für DashScope nicht initialisiert.');

    const completion = await this.openai.chat.completions.create({
      model: model,
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
    });

    const textResponse = completion.choices[0]?.message?.content;
    if (!textResponse) {
      throw new Error(`Keine Antwort von ${model} erhalten.`);
    }

    const cleanJson = textResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const parsed = JSON.parse(cleanJson);
    this.logger.log(`✅ Erfolg mit Modell: ${model}`);
    return parsed;
  }

  private async askOllama(prompt: string) {
    this.logger.log('Nutze lokales Ollama...');
    try {
      const response = await fetch(this.OLLAMA_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'llama3',
          prompt: prompt,
          stream: false,
          format: 'json',
        }),
      });

      const data = await response.json();
      if (!data.response) throw new Error('Empty response');

      const parsed = JSON.parse(data.response);
      this.logger.log(`Ollama Erfolg: "${parsed.name}"`);
      return parsed;
    } catch (error) {
      this.logger.error('Ollama Fehler:', error);
      throw error;
    }
  }
}


