import axios from "axios";
import { parseStringPromise } from "xml2js";

import Vehicle from "../models/vehicleModel";

import { delay } from "../utils/delay";
import { cache } from "../utils/cache";

const FETCH_LIMIT = 25;
let delayMS = 200;
const cacheTTL = 60 * 60; // 1 hour

export async function fetchMakesXML(): Promise<any> {
  const cachedMakes = cache.get("makes");
  if (cachedMakes) {
    return cachedMakes;
  }

  try {
    const makesResponse = await axios.get(`${process.env.MAKES_API_URL}?format=XML`);
    delayMS = Math.max(200, delayMS - 100);
    const makesData = await parseStringPromise(makesResponse.data);
    const makes = makesData.Response.Results[0].AllVehicleMakes;

    cache.set("makes", makes, cacheTTL);
    return makes;
  } catch (error: any) {
    if (error?.response && error?.response?.status === 403) {
      console.warn(`Received 403 Forbidden, retrying after delay (${delayMS}ms)...`);
      delayMS += 200;
      await delay(delayMS);
      return fetchMakesXML();
    }
    console.error("Failed to fetch Makes XML data:", error);
    throw new Error("Failed to fetch Makes XML data");
  }
}

export async function fetchVehicleTypesXML(makeId: string): Promise<any> {
  const cachedVehicleTypes = cache.get(`vehicleTypes_${makeId}`);
  if (cachedVehicleTypes) {
    return cachedVehicleTypes;
  }

  try {
    const vehicleTypesResponse = await axios.get(`${process.env.MAKE_TYPES_API_URL}/${makeId}?format=xml`);
    delayMS = Math.max(200, delayMS - 100);
    const vehicleTypesData = await parseStringPromise(vehicleTypesResponse.data);
    const vehicleTypes = vehicleTypesData.Response.Results[0].VehicleTypesForMakeIds;

    cache.set(`vehicleTypes_${makeId}`, vehicleTypes, cacheTTL);
    return vehicleTypes;
  } catch (error: any) {
    if (error?.response && error?.response?.status === 403) {
      console.warn(`Received 403 Forbidden, retrying after delay (${delayMS}ms)...`);
      delayMS += 200;
      await delay(delayMS);
      return fetchVehicleTypesXML(makeId);
    }
    console.error("Failed to fetch Vehicle Types XML data:", error);
    throw new Error("Failed to fetch Vehicle Types XML data");
  }
}

export async function fetchAndParseXML(): Promise<void> {
  try {
    const makes = await fetchMakesXML();

    for (let i = 0; i < makes.length; i += FETCH_LIMIT) {
      const limitedMakes = makes.slice(i, i + FETCH_LIMIT);
      const requests = limitedMakes.map(async (make: any) => {
        const makeId = make.Make_ID[0];
        const makeName = make.Make_Name[0];

        const existingVehicle = await Vehicle.findOne({ makeId }).lean();

        if (existingVehicle) return;

        const vehicleTypes = await fetchVehicleTypesXML(makeId);

        const vehicle = new Vehicle({
          makeId,
          makeName,
          vehicleTypes: vehicleTypes?.map((vehicleType: any) => ({
            typeId: String(vehicleType.VehicleTypeId[0]),
            typeName: vehicleType.VehicleTypeName[0],
          })),
        });

        await vehicle.save();
      });
      await Promise.allSettled(requests);
      await delay(delayMS);
    }
  } catch (error) {
    console.error("Failed to fetch and parse XML data:", error);
    throw new Error("Failed to fetch and parse XML data");
  }
}
