const path = require("path");
const fs = require("fs");

// Get to spfx package
const srcFile = path.join(__dirname, "dist/m365-roadmap.sppkg");
console.log(srcFile);

// See if the destination file exists
if (fs.existsSync(srcFile)) {
    // Delete the file
    fs.unlinkSync(srcFile);

    // Log
    console.log("Deleted the SPFx package.");
}
else { console.log("Doesn't exist");}