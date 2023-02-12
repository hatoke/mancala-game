import Hashids from "hashids";

const hashids = new Hashids("saltsalt");

export default {
  hashString(string) {
    var hex = Buffer.from(string, "utf8").toString("hex");
    return hashids.encodeHex(hex);
  },

  decodeString(string) {
    const hex = hashids.decodeHex();
    return Buffer.from(hex, "hex").toString("utf8");
  },
};
