import randomstring from "randomstring";
import PropertyBasicInfo from "../../models/propertyModels/propertiesBasicInfo.js";

const generatePropertyID = async (req) => {
  let propertyId;
  let randomStr1;
  let randomStr2;
  while (true) {
    randomStr1 = randomstring.generate({
      length: 8,
      charset: "alphabetic",
    });
    randomStr2 = randomstring.generate({
      length: 6,
      charset: "hex",
    });
    propertyId = `${randomStr1}-${randomStr2}`;
    const property = await PropertyBasicInfo.find({property_id: propertyId});
    if(property.length !== 1) {
      break;
    }
  }
  req.propertyId = propertyId;
  return propertyId;
};


function formatDate(date) {
  const options = { day: '2-digit', month: 'short', year: 'numeric' };
  return date.toLocaleDateString('en-US', options);
}
/*  We can use different locales. Such as
    'ar-AE' -->  "١٩ يوليو ٢٠٢٤"
    'hi-IN' -->  "19 जुल॰ 2024"
*/

export {
  generatePropertyID,
  formatDate,
}