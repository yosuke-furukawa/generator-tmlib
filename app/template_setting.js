var _settings = {
  jade : {
    npm: "jade",
    extension: "jade",
    consolidate: "jade"
  },
  swig : {
    npm: "swig",
    extension: "swig",
    consolidate: "swig"
  },
  hogan : {
    npm: "hogan.js",
    extension: "hjs",
    consolidate: "hogan"
  },
  ejs : {
    npm: "ejs",
    extension: "ejs",
    consolidate: "ejs"
  }
};

module.exports = function(template) {
  var setting = _settings[template];
  if (!setting) throw new Error("Undefined template : " + template);
  return setting;
};
