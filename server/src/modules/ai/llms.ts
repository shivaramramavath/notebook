import env from "#configs/env.js";
import { ChatGroq } from "@langchain/groq";

export const MODELS = {
  REASONING: "openai/gpt-oss-120b",
  FAST: "openai/gpt-oss-20b",
} as const;

type CreateModelOptions = {
  model: string;
  temperature?: number;
  maxRetries?: number;
  streaming?: boolean;
};

const createModel = ({
  model,
  temperature = 0.1,
  maxRetries = 2,
  streaming = true,
}: CreateModelOptions) =>
  new ChatGroq({
    apiKey: env.GROQ_API_KEY,
    model,
    temperature,
    maxRetries,
    streaming,
  });

export const chatModel = createModel({
  model: MODELS.REASONING,
  temperature: 0.3,
});

export const pageModel = createModel({
  model: MODELS.REASONING,
  temperature: 0,
});

export const intentModel = createModel({
  model: MODELS.FAST,
  temperature: 0,
});

export const plannerModel = createModel({
  model: MODELS.FAST,
  temperature: 0,
});

export const suggestionModel = createModel({
  model: MODELS.FAST,
  temperature: 0.6,
});
