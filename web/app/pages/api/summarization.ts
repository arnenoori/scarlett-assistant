// api/summarization.ts
import Anthropic from '@anthropic-ai/sdk';
import { config } from 'dotenv';

config();

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export async function processContent(content: string) {
  const response = await anthropic.messages.create({
    model: "claude-3-haiku-20240307",
    max_tokens: 500,
    messages: [
      {
        role: "user",
        content: `
          Analyze the following Terms of Service document and produce a JSON response that simplifies the key sections for a general audience. If certain key sections (such as "Data Collection", "User Rights", "Limitations of Liability", "Cancellation & Termination") exist, summarize them. Additionally, evaluate the document for any potential dangers or unfavorable terms to the user, such as excessive data collection, limited user rights, or other restrictive conditions. Highlight these in a separate section within the JSON.
          
          Input Document:
          ${content}
          
          Expected JSON Output Format:
          {
            "summary": {
              "DataCollection": "Summarize this section in simplified terms.",
              "UserRights": "Summarize this section in simplified terms.",
              "LimitationsOfLiability": "Summarize this section in simplified terms.",
              "CancellationAndTermination": "Summarize this section in simplified terms."
            },
            "potentialDangers": [
              "Highlight any sections that may pose a risk to the user, such as excessive data collection or unfair user restrictions."
            ],
            "overallAssessment": "Indicate whether the terms of service are generally favorable or unfavorable to the user, based on the summaries and identified potential dangers."
          }
          Please ensure the response strictly follows this JSON structure. Wrap the JSON response in triple backticks (\`\`\`) to ensure it is properly formatted.
        `
      }
    ],
  });

  // Accessing the text of the first content block in the response
  const processedText = response.content?.[0]?.text || "Error: Unable to process content.";

  // Extract the JSON from the response by finding the content between triple backticks
  const jsonMatch = processedText.match(/```([\s\S]*)```/);
  if (jsonMatch) {
    return jsonMatch[1].trim();
  } else {
    console.error("Error: Unable to extract JSON from the processed content.");
    return "{}";
  }
}