import mongoose from "mongoose";


const PropertyFacilitiesSchema = new mongoose.Schema({ 
  property_id: { 
    type: mongoose.Types.ObjectId, 
    unique: true,
    required: true, 
  },
  amenities: {
    type: String,
    enum: ["Furnished", "Semi Furnished", "Pet Allowed", "Security"],
    required: true,
  },
  availability: {
    type: String,
    required: true,
  },
  upgrade: {
    type: String,
    default: "", 
    required: false,
  }
});

const PropertyFacilities = mongoose.model("PropertyFacilities", PropertyFacilitiesSchema);

export default PropertyFacilities;

/*
    AMENITIES 

    Central A/C

    Private Garden

    Shared Pool

    Security

    Covered Parking

    Kitchen Appliances

    Pets Allowed

    Shared Gym

    Children's Play Area

*/