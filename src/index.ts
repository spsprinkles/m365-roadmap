import { ContextInfo } from "gd-sprest-bs";
import { App } from "./app";
import Strings from "./strings";

// Styling
import "./styles.scss";

// Get the element and render the app if it is found
let elApp = document.querySelector("#" + Strings.AppElementId) as HTMLElement;
if (elApp) {
    // Create the application
    new App(elApp);
}

// Create the global variable for this solution
window[Strings.GlobalVariable] = {
    render: (el, context?, csvUrl?:string) => {
        // See if the page context exists
        if (context) {
            // Set the context
            ContextInfo.setPageContext(context);
        }

        // Create the application
        new App(el, csvUrl);
    }
}