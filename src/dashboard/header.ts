import { Components } from "gd-sprest-bs";
import Strings from "../strings";

/**
 * Header
 */
export class Header {
    private _el: HTMLElement = null;

    // Constructor
    constructor(el: HTMLElement) {
        // Save the properties
        this._el = el;

        // Render the header
        this.render();
    }

    // Renders the component
    private render() {
        // Render a jumbotron
        Components.Jumbotron({
            el: this._el,
            className: "header",
            lead: Strings.ProjectName
        });
    }
}