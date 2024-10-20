import { fetchAndParseXML } from "../services/xmlParserService";

export async function populateVehicles(): Promise<void> {
  try {
    await fetchAndParseXML();
  } catch (error) {
    console.error("Failed to populate vehicles:", error);
  }
}
