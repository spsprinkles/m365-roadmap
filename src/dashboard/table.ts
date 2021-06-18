import { Components } from "gd-sprest-bs";
import { DataSource, IItem } from "../ds";

// DataTables.net
import * as $ from "jquery";
import "datatables.net";
import "datatables.net-bs4";

/**
 * Data Table
 */
export class DataTable {
    private _datatable = null;
    private _el: HTMLElement = null;
    private _elLoader: HTMLElement = null;
    private _elTable: HTMLElement = null;
    private _loader: Components.IProgress = null;

    // Constructor
    constructor(el: HTMLElement) {
        // Save the properties
        this._el = el;

        // Set the template
        this._el.innerHTML = `
            <div id="loader"></div>
            <div id="datatable"></div>
        `;
        this._elLoader = this._el.querySelector("#loader");
        this._elTable = this._el.querySelector("#datatable");

        // Render the footer
        this.render();
    }

    // Applies the datatables.net plugin
    private applyPlugin(table: Components.ITable) {
        // Set the datatable properties
        let dtProps: any = {
            dom: 'rt<"row"<"col-sm-4"l><"col-sm-4"i><"col-sm-4"p>>'
        };

        // Render the datatable
        this._datatable = $(table.el).DataTable(dtProps);
    }

    // Renders the component
    private render() {
        // Render the progress bar
        this._loader = Components.Progress({
            el: this._elLoader,
            isAnimated: true,
            isStriped: true,
            max: 100,
            min: 0,
            size: 100
        });

        // Refresh the data
        this.refresh();
    }

    /** Public Interface */

    // Filters the cloud
    filterCloud(value) { this._datatable.column(5).search(value).draw(); }

    // Filters the product
    filterProduct(value) { this._datatable.column(1).search(value).draw(); }

    // Filters the release
    filterRelease(value) { this._datatable.column(6).search(value).draw(); }

    // Filters the status
    filterStatus(value) { this._datatable.column(0).search(value).draw(); }

    // Method to reload the data
    refresh() {
        // Show the loader
        this._loader.show();

        // See if the datatable exists
        if (this._datatable != null) {
            // Clear the datatable
            this._datatable.clear();
            this._datatable.destroy();
            this._datatable = null;
        }

        // Clear the datatable element
        while (this._elTable.firstChild) { this._elTable.removeChild(this._elTable.firstChild); }

        // Load the data
        DataSource.load().then(items => {
            // Render the data table
            let table = Components.Table({
                el: this._elTable,
                columns: [
                    {
                        name: "",
                        title: "Status",
                        onRenderCell: (el, col, item: IItem) => {
                            let badge: Components.IBadgeProps = {
                                el,
                                content: item.status,
                                type: Components.BadgeTypes.Dark
                            };

                            switch (item.status) {
                                case "Cancelled":
                                    badge.type = Components.BadgeTypes.Danger;
                                    break;
                                case "In development":
                                    badge.type = Components.BadgeTypes.Success;
                                    break;
                                case "Launched":
                                    badge.type = Components.BadgeTypes.Primary;
                                    break;
                                case "Rolling out":
                                    badge.type = Components.BadgeTypes.Warning;
                                    break;
                            }

                            // Render the badge
                            Components.Badge(badge);
                        }
                    },
                    {
                        name: "product",
                        title: "Product"
                    },
                    {
                        name: "productTags",
                        title: "Associated Products"
                    },
                    {
                        name: "",
                        title: "Feature",
                        onRenderCell: (el, col, item: IItem) => {
                            // Ensure a link exists
                            if (item.link) {
                                // Render a link
                                Components.Button({
                                    el,
                                    text: item.feature,
                                    type: Components.ButtonTypes.OutlineLink,
                                    onClick: () => {
                                        // Open in a new window
                                        window.open(item.link, "_blank");
                                    }
                                });
                            } else {
                                // Render text
                                el.innerHTML = item.feature;
                            }
                        }
                    },
                    {
                        name: "description",
                        title: "Description"
                    },
                    {
                        name: "",
                        title: "Cloud Instance",
                        onRenderCell: (el, col, item: IItem) => {
                            // Parse the cloud instances
                            let instances = item.cloudInstance.split(',');
                            for (let i = 0; i < instances.length; i++) {
                                let instance = instances[i];

                                // Create the badge
                                let badge: Components.IBadgeProps = {
                                    el,
                                    content: instance,
                                    type: Components.BadgeTypes.Dark
                                };

                                // Set the type
                                switch (instance) {
                                    case "All environments":
                                        badge.type = Components.BadgeTypes.Success;
                                        break;
                                    case "DoD":
                                        badge.type = Components.BadgeTypes.Danger;
                                        break;
                                    case "Education":
                                        badge.type = Components.BadgeTypes.Warning;
                                        break;
                                    case "GCC":
                                        badge.type = Components.BadgeTypes.Primary;
                                        break;
                                    case "GCC High":
                                        badge.type = Components.BadgeTypes.Secondary;
                                        break;
                                    case "Germany":
                                        badge.type = Components.BadgeTypes.Info;
                                        break;
                                    case "Worldwide (Standard Multi-Tenant)":
                                        badge.type = Components.BadgeTypes.Dark;
                                        break;
                                }

                                // Render the badge
                                Components.Badge(badge);
                            }
                        }
                    },
                    {
                        name: "release",
                        title: "Release",
                    },
                    {
                        name: "addedToRoadmap",
                        title: "Date Added",
                    }
                ],
                rows: items
            });

            // Apply the plugin
            this.applyPlugin(table);

            // Hide the loader
            this._loader.hide();
        });
    }

    // Searches the datatable
    search(value: string = "") {
        // Search the table
        this._datatable.search(value).draw();
    }
}