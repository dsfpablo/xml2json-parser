import Vehicle from "../models/vehicleModel";

export const resolvers = {
  Query: {
    vehicles: async () => {
      const vehicles = await Vehicle.find();
      return vehicles;
    },
  },
};
