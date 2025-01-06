import * as cheerio from "cheerio";

import { ExtractTextFromElementTask } from "@/features/tasks/components/extract-text-from-element";

import { ExecutionEnvironment } from "@/features/executor/types";

export async function ExtractTextFromElementExecutor(
  env: ExecutionEnvironment<typeof ExtractTextFromElementTask>
): Promise<boolean> {
  try {
    const selector = env.getInput("Selector");

    if (!selector) return false;

    const html = env.getInput("Html");

    if (!html) {
      console.log("🔴 HTML NOT DEFINED");
      return false
    };

    const $ = cheerio.load(html);
    const element = $(selector);

    if (!element) {
      console.error("🔴 ELEMENT NOT FOUND");
      return false;
    }

    const extractedText = $.text(element);

    if (!extractedText) {
      console.error("🔴 ELEMENT HAS NO TEXT");
      return false;
    }

    env.setOutput("Extracted text", extractedText);

    return true;
  } catch (error) {
    console.error("🔴 ERROR", error);
    return false;
  }
}