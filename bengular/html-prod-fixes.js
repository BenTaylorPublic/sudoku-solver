const fs = require("fs");

let toReplace = [];

const componentFileNames = fs.readdirSync("./src/components/");
for (let i = 0; i < componentFileNames.length; i++) {
    let componentName = componentFileNames[i].replace(".html", "");
    let component = fs.readFileSync("./src/components/" + componentFileNames[i], 'utf8');
    toReplace.push({
        search: "<component data-name=\"" + componentName + "\"></component>",
        replace: component
    });
}

const docsFileNames = fs.readdirSync("./docs/");
for (let i = 0; i < docsFileNames.length; i++) {
    let docFilePath = "./docs/" + docsFileNames[i];
    if (!docFilePath.includes(".html")) {
        continue;
    }
    let html = fs.readFileSync(docFilePath, 'utf8');
    for (let j = 0; j < toReplace.length; j++) {
        html = html.replace(toReplace[j].search, toReplace[j].replace);
    }
    fs.writeFileSync(docFilePath, html, 'utf8', function (err3) {
        if (err3) return console.log(err3);
    });
}