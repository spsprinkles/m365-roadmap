import { Components } from "gd-sprest-bs";
import { filterSquare } from "gd-sprest-bs/build/icons/svgs/filterSquare";
import Strings from "../strings";

/**
 * Properties
 */
interface INavProps {
    el: HTMLElement;
    onShowFilter: Function;
    onSearch: (value: string) => void;
    onUpdate: Function;
}
/**
 * Navigation
 */
export class Navigation {
    private _el: HTMLElement = null;
    private _filterEvent: Function = null;
    private _searchEvent: Function = null;

    // Constructor
    constructor(props: INavProps) {
        // Save the properties
        this._el = props.el;
        this._filterEvent = props.onShowFilter;
        this._searchEvent = props.onSearch;

        // Render the navigation
        this.render();
    }

    // Renders the component
    private render() {
        // Render a navbar
        let nav = Components.Navbar({
            el: this._el,
            brand: Strings.ProjectName,
            className: "header",
            searchBox: {
                hideButton: true,
                onChange: this._searchEvent as any,
                onSearch: this._searchEvent as any
            }
        });

        // Render the filter icon
        let icon = document.createElement("div");
        icon.classList.add("filter-icon");
        icon.classList.add("nav-link");
        icon.classList.add("text-dark");
        icon.style.cursor = "pointer";
        icon.appendChild(filterSquare());
        icon.addEventListener("click", this._filterEvent as any);
        nav.el.firstElementChild.appendChild(icon);
    }
}