import mongoose from "mongoose";

const ownerPropertySchema = mongoose.Schema({
  /* NOTE:
    1. ownerId & propertyId are used to store ObjectId of respective owner and property
    2. Each owner & property has unique ID such as OWN#1001 and KyzwpzaZ-Ca1234
  */
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PropertyOwners",
    required: true,
  },
  propertyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Property",
    required: true,
  },
});

const OwnersWithProperty = mongoose.model('OwnersWithProperties', ownerPropertySchema);

export default OwnersWithProperty;
