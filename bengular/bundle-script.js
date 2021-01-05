console.log("Bundling...");

const bundles = [
    {
        name: "index",
        entryDir: "index/"
    }
];

const shared = [
    {
        name: "dom-text-input",
        entryDir: "classes/"
    },
    {
        name: "dom-variable",
        entryDir: "classes/"
    },
    {
        name: "text-validation-ruleset",
        entryDir: "classes/"
    },
    {
        name: "http-service",
        entryDir: "services/"
    },
    {
        name: "constants-service",
        entryDir: "services/"
    },
    {
        name: "redirect-service",
        entryDir: "services/"
    },
    {
        name: "error-service",
        entryDir: "services/"
    },
    {
        name: "route-param-service",
        entryDir: "services/"
    },
    {
        name: "api-service",
        entryDir: "services/"
    },
    {
        name: "header-service",
        entryDir: "services/"
    },
    {
        name: "document-service",
        entryDir: "services/"
    },
    {
        name: "widget-service",
        entryDir: "services/widgets/"
    },
    {
        name: "widget-types",
        entryDir: "services/widgets/"
    },
    {
        name: "widget-edit-service",
        entryDir: "services/widgets/"
    },
    {
        name: "event-service",
        entryDir: "services/"
    },
    {
        name: "home-widgets-data-helper",
        entryDir: "services/widgets/"
    },
];


const environment = process.argv.slice(2)[0];

console.log("Environment: " + environment);

let outDir = "";
if (environment === "prod") {
    outDir = "docs/";
} else if (environment === "dev") {
    outDir = "src/";
}

const browserify = require("browserify");
const fs = require("fs");

for (const bundle of bundles) {
    let outputFile;
    if (environment === "prod") {
        outputFile = "./" + outDir + bundle.name + ".bundle.js";
    } else {
        outputFile = "./" + outDir + "pages/" + bundle.entryDir + bundle.name + ".bundle.js";
    }

    let b = browserify();
    b.add("./tsc-dist/pages/" + bundle.entryDir + bundle.name + ".js");
    for (const sharedJs of shared) {
        b.exclude("./tsc-dist/shared/" + sharedJs.entryDir + sharedJs.name + ".js");
    }
    b.bundle(function (err1, buf) {
        if (err1) throw err1;

        /*
        Manually manipulating the javascript
        This is because in the dom it's a flat structure, but Browserify requires still have the relative layout
        The only thing it needs to "require" is shared stuff, so it should be fine to replace fix the path
        */
        let bundleAsString = buf.toString();
        bundleAsString = bundleAsString.split(`"../../../`).join(`"./`);
        bundleAsString = bundleAsString.split(`"../../`).join(`"./`);
        bundleAsString = bundleAsString.split(`"../`).join(`"./`);

        checkNonSharedBundle(bundleAsString);

        fs.writeFileSync(outputFile, bundleAsString, function (err3) {
            if (err3) throw err3;
        });
    });
}

//Doing the shared bundle now
let b = browserify();
for (const sharedJs of shared) {
    b.require("./tsc-dist/shared/" + sharedJs.entryDir + sharedJs.name + ".js", {
        expose: "./shared/" + sharedJs.entryDir + sharedJs.name
    });
}
b.bundle(function (err4, buf) {
    if (err4) throw err4;
    let bundleAsString = buf.toString();

    bundleAsString += fs.readFileSync("./bengular/generated/on-page-load-" + environment + ".js", 'utf8');
    fs.writeFileSync("./" + outDir + "shared.bundle.js", bundleAsString, function (err5) {
        if (err5) throw err5;
    });
});

//Helper function
function checkNonSharedBundle(bundleAsString) {
    const regex = new RegExp(/"\.\/shared\/[^,]*":[^u]/g)
    if (regex.test(bundleAsString) &&
        environment === "prod") {
        throw "Shared module bundled into regular bundle";
    }
}