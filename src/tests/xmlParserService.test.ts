import { fetchMakesXML, fetchVehicleTypesXML } from "../services/xmlParserService";

jest.mock("../services/xmlParserService", () => ({
  fetchVehicleTypesXML: jest.fn(),
}));

jest.mock("../models/vehicleModel");

describe("XML Parser Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should fetch makes XML correctly", async () => {
    const mockMake = { Make_ID: ["12858"], Make_Name: ["#1 ALPINE CUSTOMS"] };
    const makes = await fetchMakesXML();
    expect(makes?.[0]).toEqual(mockMake);
    makes.forEach((make: any) => {
      expect(make).toHaveProperty("Make_ID");
      expect(make).toHaveProperty("Make_Name");
    });
  });

  it("should fetch vehicle types XML correctly", async () => {
    const mockVehicleTypes = [{ VehicleTypeId: ["6"], VehicleTypeName: ["Trailer"] }];
    const vehicleTypes = await fetchVehicleTypesXML("12858");
    expect(vehicleTypes).toEqual(mockVehicleTypes);
    vehicleTypes.forEach((vehicleType: any) => {
      expect(vehicleType).toHaveProperty("VehicleTypeId");
      expect(vehicleType).toHaveProperty("VehicleTypeName");
    });
  });
});
