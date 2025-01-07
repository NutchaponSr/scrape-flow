import * as cheerio from "cheerio";

import { ExtractTextFromElementTask } from "@/features/tasks/components/extract-text-from-element";

import { ExecutionEnvironment } from "@/features/executor/types";

export async function ExtractTextFromElementExecutor(
  env: ExecutionEnvironment<typeof ExtractTextFromElementTask>
): Promise<boolean> {
  try {
    const selector = env.getInput("Selector");

    if (!selector) {
      env.log.error("🔴 Selector not defined");
      return false;
    };

    const html = env.getInput("Html");

    if (!html) {
      env.log.error("🔴 Html not defined");
      return false
    };

    const $ = cheerio.load(html);
    const element = $(selector);

    if (!element) {
      env.log.error("🔴 Element not found");
      return false;
    }

    const extractedText = $.text(element);

    if (!extractedText) {
      env.log.error("🔴 Element has no text");
      return false;
    }

    env.setOutput("Extracted text", extractedText);

    return true;
  } catch (error) {
    env.log.error(`🔴 Error: ${error}`);
    return false;
  }
}