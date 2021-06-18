import { Components } from "gd-sprest-bs";
import Strings from "../strings";

/**
 * Footer
 */
export class Footer {
    private _el: HTMLElement = null;

    // Constructor
    constructor(el: HTMLElement) {
        // Save the properties
        this._el = el;

        // Render the footer
        this.render();
    }

    // Renders the component
    private render() {
        // Render a navbar
        Components.Navbar({
            el: this._el,
            itemsEnd: [
                {
                    text: Strings.Version
                }
            ]
        });
    }
}