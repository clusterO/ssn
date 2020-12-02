const ACRCloud = require("acr-cloud");
const multer = require("multer");
const fs = require("fs");

exports.xazam = (req, res) => {
  const acr = new ACRCloud({
    access_key: "bc613c4be54b627b23423bac82683817",
    access_secret: "zMXFThjJqG6PmRLAMJJ3oKm0mIyjJZcCPHQi0alg",
    requrl: "identify-eu-west-1.acrcloud.com",
    http_method: "POST",
    http_uri: "/v1/identify",
    audio_format: "wav",
    data_type: "audio",
    signature_version: "2",
    timestamp: Date.now(),
  });

  let storage = multer.diskStorage({
    destination: "./file",
  });

  let upload = multer({
    storage: storage,
  }).any();

  upload(req, res, (err) => {
    if (err) return res.end("Error");
    else {
      req.files.forEach((item) => {
        let buffer = fs.readFileSync(item.path);
        let path = `./file/${item.filename}.wav`;
        fs.writeFileSync(path, buffer);

        let sample = fs.readFileSync(path);
        acr.identify(sample).then((data) => {
          if (JSON.parse(data.body).status.msg === "Success")
            return res.status(200).send(JSON.parse(data.body).metadata.music);

          res.status(204).send({ msg: "Song not recognized" });
        });
      });
    }
  });
};
