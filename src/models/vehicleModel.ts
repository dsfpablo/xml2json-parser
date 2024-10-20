import mongoose, { Schema } from "mongoose";

interface IVehicleType {
  typeId: number;
  typeName: string;
}

interface IVehicle {
  makeId: number;
  makeName: string;
  vehicleTypes: IVehicleType[];
}

const VehicleSchema: Schema = new Schema({
  makeId: { type: Number, required: true, unique: true },
  makeName: { type: String, required: true },
  vehicleTypes: { type: Array, required: false },
});

export default mongoose.model<IVehicle>("Vehicle", VehicleSchema);
