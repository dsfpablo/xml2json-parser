import cron from "node-cron";

import { fetchAndParseXML } from "../services/xmlParserService";

export const cronTasks = () => {
  // fetch new makes every hour to keep them up to date
  cron.schedule("0 * * * *", async () => {
    try {
      await fetchAndParseXML();
    } catch (error) {
      console.error("Failed to fetch makes during scheduled task:", error);
    }
  });
};
