var fs = require("fs"),
    http = require("http");

http.createServer(function (req, res) {
    //Removing from route params onwards
    if (req.url.includes("?")) {
        req.url = req.url.substring(0, req.url.indexOf("?"));
    }
    if (req.url.includes("global-styles.css")) {
        req.url = "/styles/" + req.url;
    } else if ((req.url.includes(".js") ||
        req.url.includes(".css") ||
        req.url.includes(".html")) &&
        !req.url.includes("shared.bundle.js")) {
        //Then it should be in the folder with the html
        const regex = new RegExp(/[/.]/g);
        let urlSplit = req.url.split(regex);

        if (urlSplit.length < 2) {
            res.writeHead(404);
            res.end("urlSplit length short: " + JSON.stringify(urlSplit));
            return;
        }

        req.url = "/pages/" + urlSplit[1] + req.url;
    }
    if (req.url.includes(".js")) {
        res.setHeader("Content-Type", "text/javascript");
    }
    fs.readFile(__dirname + "/../src" + req.url, 'utf8', function (err, data) {
        if (err) {
            res.writeHead(404);
            res.end(JSON.stringify(err));
            return;
        }
        let result = data;
        if (req.url.includes(".html")) {
            //Components replacement logic
            let toReplace = [];
            let fileNames = fs.readdirSync("./src/components/");
            for (let i = 0; i < fileNames.length; i++) {
                let componentName = fileNames[i].replace(".html", "");
                let data = fs.readFileSync("./src/components/" + fileNames[i], 'utf8');
                toReplace.push({
                    search: "<component data-name=\"" + componentName + "\"></component>",
                    replace: data
                });
            }
            for (let j = 0; j < toReplace.length; j++) {
                result = result.replace(toReplace[j].search, toReplace[j].replace);
            }
        }
        res.writeHead(200);
        res.end(result);
    });
}).listen(8080);