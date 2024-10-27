// import { ChatOpenAI } from "@langchain/openai";

// export const analyze = async (prompt: any) => {
//     const model = new ChatOpenAI({
//         temperature: 0,
//         modelName: "gpt-3.5-turbo",
//         openAIApiKey: process.env.OPENAI_API_KEY,
//     });
//     const result = await model.invoke(prompt);
//     console.log(result, "result");
// };

import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import z from "zod";
import { StructuredOutputParser } from "langchain/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";
import { Document } from "langchain/document";
import { loadQARefineChain } from "langchain/chains";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";

const parser = new StructuredOutputParser(
    z.object({
        mood: z
            .string()
            .describe("The mood of the person who wrote the journal entry"),
        summary: z.string().describe("Quick summary of the entire entry"),
        subject: z.string().describe("The subject of the journal entry."),
        negative: z
            .boolean()
            .describe(
                "Is the journal entry is negative? (i.e. does it contain negative emotions?)"
            ),
        color: z
            .string()
            .describe(
                "A hexidecimal color code representing the mood of the journal entry. Example #0101FE for blue representing happiness"
            ),
        sentimentScore: z
            .number()
            .describe(
                "sentiment of the text and rated on a scale from -10 to 10, where -10 is extremely negative, 0 is neutral, and 10 is extremely positive."
            ),
    })
);

const getPrompt = async (content: string) => {
    const format_instructions = parser.getFormatInstructions();
    const prompt = new PromptTemplate({
        template: `Analyze the following journal entry. Follow the instructions and format your response to match the format instructions, no matter what! \n{format_instructions}\n{entry}`,
        inputVariables: ["entry", "format_instructions"],
    });

    const input = await prompt.format({
        entry: content,
        format_instructions,
    });

    return input;
};

export const analyze = async (content: string) => {
    const input = await getPrompt(content);
    const llm = new ChatGoogleGenerativeAI({
        model: "gemini-1.5-flash",
        temperature: 0,
        maxRetries: 2,
        apiKey: process.env.GOOGLE_API_KEY,
    });

    try {
        const result = await llm.invoke(input);
        const jsonResponse = String(result.content)
            .replace("```json\n", "")
            .replace("\n```", "");

        console.log(JSON.parse(jsonResponse));
        return JSON.parse(jsonResponse);
    } catch (error) {
        console.error("Error invoking Gemini model:", error);
    }
};

export const qa = async (question: string, entries: string[]) => {
    const docs = entries.map(
        (entry: any) =>
            new Document({
                pageContent: entry.content,
                metadata: { id: entry.id, createdAt: entry.createdAt },
            })
    );

    const model = new ChatGoogleGenerativeAI({
        model: "gemini-1.5-flash",
        temperature: 0,
    });

    const chain = loadQARefineChain(model);
    const embeddings = new GoogleGenerativeAIEmbeddings();
    const store = await MemoryVectorStore.fromDocuments(docs, embeddings);
    const relavantDocs = await store.similaritySearch(question);

    const res = await chain.invoke({
        input_documents: relavantDocs,
        question,
    });

    return res.output_text;
};
