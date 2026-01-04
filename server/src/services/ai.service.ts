import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface GenerateEbookParams {
  topic: string;
  chapters: number;
  audience: string;
  tone: string;
  objective?: string;
}

export interface Chapter {
  number: number;
  title: string;
  content: string;
  wordCount: number;
}

export const generateEbookContent = async (
  params: GenerateEbookParams
): Promise<{ chapters: Chapter[]; title: string; subtitle: string }> => {
  const { topic, chapters: chapterCount, audience, tone, objective } = params;

  // Generate title and structure
  const structurePrompt = `Create an ebook structure about "${topic}".

Context:
- Number of chapters: ${chapterCount}
- Target audience: ${audience}
- Tone: ${tone}
- Objective: ${objective || 'Educate and inform the reader'}

Generate a JSON response with:
1. A compelling title
2. A subtitle
3. Chapter titles (exactly ${chapterCount} chapters)

Format:
{
  "title": "Main Title",
  "subtitle": "Engaging subtitle",
  "chapters": [
    {"number": 1, "title": "Chapter title"}
  ]
}`;

  const structureResponse = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [{ role: 'user', content: structurePrompt }],
    response_format: { type: 'json_object' },
    temperature: 0.7,
  });

  const structure = JSON.parse(structureResponse.choices[0].message.content || '{}');

  // Generate content for each chapter
  const chapters: Chapter[] = [];

  for (const chapterInfo of structure.chapters) {
    const contentPrompt = `Write Chapter ${chapterInfo.number}: "${chapterInfo.title}" for an ebook about "${topic}".

Context:
- Target audience: ${audience}
- Tone: ${tone}
- Chapter should be approximately 1500-2000 words
- Use markdown formatting

Write engaging, informative content that delivers value to the reader.`;

    const contentResponse = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [{ role: 'user', content: contentPrompt }],
      temperature: 0.7,
      max_tokens: 3000,
    });

    const content = contentResponse.choices[0].message.content || '';
    const wordCount = content.split(/\s+/).length;

    chapters.push({
      number: chapterInfo.number,
      title: chapterInfo.title,
      content,
      wordCount,
    });
  }

  return {
    title: structure.title,
    subtitle: structure.subtitle,
    chapters,
  };
};

export const chatWithAI = async (message: string, context?: string): Promise<string> => {
  const systemPrompt = context ||
    'You are a helpful AI assistant specialized in ebook creation and writing. Provide clear, actionable advice.';

  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: message },
    ],
    temperature: 0.7,
  });

  return response.choices[0].message.content || '';
};

export const improveContent = async (content: string, instruction: string): Promise<string> => {
  const prompt = `Original content:
${content}

Instruction: ${instruction}

Provide the improved version:`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
  });

  return response.choices[0].message.content || '';
};
