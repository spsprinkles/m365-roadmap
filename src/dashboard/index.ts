import { FilterSlideout } from "./filter";
import { Footer } from "./footer";
import { Header } from "./header";
import { Navigation } from "./navigation";
import { DataTable } from "./table";

// Styling
import "./styles.scss";

/**
 * Dashboard
 */
export class Dashboard {
    private _el: HTMLElement = null;

    // Constructor
    constructor(el: HTMLElement) {
        // Update the properties
        this._el = el;

        // Render the dashboard
        this.render();
    }

    // Renders the component
    private render() {
        // Create the filters
        let filters = new FilterSlideout({
            onFilterCloud: (value) => {
                // Filter the data table
                dt.filterCloud(value);
            },
            onFilterProduct: (value) => {
                // Filter the data table
                dt.filterProduct(value);
            },
            onFilterRelease: (value) => {
                // Filter the data table
                dt.filterRelease(value);
            },
            onFilterStatus: (value) => {
                // Filter the data table
                dt.filterStatus(value);
            }
        });

        // Render the template
        this._el.innerHTML = `
        <div class="dashboard">
            <div class="row">
                <div id="navigation" class="col"></div>
            </div>
            <div class="row">
                <div id="header" class="col"></div>
            </div>
            <div class="row">
                <div id="datatable" class="col"></div>
            </div>
            <div class="row">
                <div id="footer" class="col"></div>
            </div>
        </div>`;

        // Render the header
        new Header(this._el.querySelector("#header"));

        // Render the navigation
        let nav = new Navigation({
            el: this._el.querySelector("#navigation"),
            onSearch: value => {
                // Search the data table
                dt.search(value);
            },
            onShowFilter: () => {
                // Show the filter
                filters.show();
            },
            onUpdate: () => {
                // Update the data table
                dt.refresh();
            }
        });

        // Render the data table
        let dt = new DataTable(this._el.querySelector("#datatable"));

        // Render the footer
        new Footer(this._el.querySelector("#footer"));
    }
}