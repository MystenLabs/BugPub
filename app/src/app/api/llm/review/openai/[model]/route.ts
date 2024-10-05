// app/src/app/api/llm/review/openai/[model]/route.ts

import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { getAuditMovePrompt } from "@/lib/prompt/getAuditMovePrompt";

export const runtime = "edge";

export async function POST(
  req: NextRequest,
  { params }: { params: { model: string } },
) {
  const model = params.model;

  if (!model) {
    return NextResponse.json(
      { error: "Model parameter is required" },
      { status: 400 },
    );
  }

  const body = await req.json();
  console.log("Received request body:", body);

  const { code, language } = body;
  console.log({ code, language });
  if (!code || !language) {
    return NextResponse.json(
      { error: "Data or API key is missing" },
      { status: 400 },
    );
  }

  let prompt = getAuditMovePrompt(code);

  let openai_api_key = process.env.OPENAI_API_KEY;
  console.log({ model });
  if (model.startsWith("o1")) {
    prompt = prompt.map((message) =>
      message.role === "system" ? { ...message, role: "user" } : message,
    );
  }

  const openai = new OpenAI({
    apiKey: openai_api_key,
  });

  if (model.startsWith("o1")) {
    let model_output = "";

    setTimeout(async () => {
      const response = await openai.chat.completions.create({
        model: model,
        messages: prompt,
        stream: false,
      });
      model_output = response.choices[0].message.content || "";
    }, 1);

    return new StreamingTextResponse(
      new ReadableStream({
        async start(controller) {
          try {
            while (true) {
              if (!model_output) {
                let data = new TextEncoder().encode("DOING_CoT_Dummy\n");
                controller.enqueue(data);
                await new Promise((resolve) => setTimeout(resolve, 1000));
              } else {
                controller.enqueue(new TextEncoder().encode(model_output));
                controller.close();
                break;
              }
            }
          } catch (error) {
            controller.error(error);
          }
        },
      }),
    );
  } else {
    const response = await openai.chat.completions.create({
      model: model,
      messages: prompt,
      stream: true,
    });

    const stream = OpenAIStream(response);
    return new StreamingTextResponse(stream);
  }
}
