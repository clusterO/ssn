const ACRCloud = require("acr-cloud");

exports.xazam = (req, res) => {
  console.log(req.body);

  const acr = new ACRCloud({
    access_key: "bc613c4be54b627b23423bac82683817",
    access_secret: "zMXFThjJqG6PmRLAMJJ3oKm0mIyjJZcCPHQi0alg",

    requrl: "identify-eu-west-1.acrcloud.com",
    http_method: "POST",
    http_uri: "/v1/identify",
    data_type: "audio",
    signature_version: "2",
    timestamp: Date.now(),
  });

  acr.identify();
};
