import puppeteer from "puppeteer";

import { ExecutionEnvironment } from "@/features/executor/types";
import { LaunchBrowserTask } from "@/features/tasks/components/launch-browser";

export async function LaunchBrowserExecutor(
  env: ExecutionEnvironment<typeof LaunchBrowserTask>
): Promise<boolean> {
  try {
    const websiteUrl = env.getInput("Website Url");

    const browser = await puppeteer.launch({
      headless: false, // For settings
    });

    env.log.info("Browser started successfully");
    
    env.setBrowser(browser);

    const page = await browser.newPage();

    await page.goto(websiteUrl);
    
    env.setPage(page);

    env.log.info(`Opened page at: ${websiteUrl}`);

    return true;
  } catch (error) {
    env.log.error(`🔴 Error: ${error}`);
    return false;
  }
}