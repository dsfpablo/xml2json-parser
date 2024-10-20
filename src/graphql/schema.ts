import { gql } from "graphql-tag";

export const typeDefs = gql`
  type VehicleType {
    typeId: Int
    typeName: String
  }

  type Vehicle {
    makeId: Int
    makeName: String
    vehicleTypes: [VehicleType]
  }

  type Query {
    vehicles: [Vehicle]
  }
`;

import Vehicle from "../models/vehicleModel";

export const resolvers = {
  Query: {
    vehicles: async () => await Vehicle.find(),
  },
};
