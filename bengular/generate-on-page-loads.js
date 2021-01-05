const fs = require("fs");
const generatedDirectory = "./bengular/generated/";

fs.writeFileSync(generatedDirectory + "on-page-load-prod.js", "", function (err1) {
    if (err1) throw err1;
});

fs.writeFileSync(generatedDirectory + "on-page-load-dev.js", "", function (err1) {
    if (err1) throw err1;
});