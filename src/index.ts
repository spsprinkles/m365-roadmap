import { ContextInfo } from "gd-sprest-bs";
import { Dashboard } from "./dashboard";
import Strings from "./strings";

// Create the global variable for this solution
window[Strings.GlobalVariable] = {
    render: (el, context?) => {
        // Set the context
        context ? ContextInfo.setPageContext(context) : null;

        // Create the dashboard
        new Dashboard(el);
    }
}

// Get the element and render the app if it is found
let elApp = document.querySelector("#" + Strings.AppElementId) as HTMLElement;
if (elApp) { new Dashboard(elApp); }