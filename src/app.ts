import { Dashboard, IFilterItem } from "dattatable";
import { Components } from "gd-sprest-bs";
import { DataSource, IItem } from "./ds";
import Strings from "./strings";

/**
 * Main Application
 */
export class App {
    private _dashboard: Dashboard = null;

    // Constructor
    constructor(el: HTMLElement) {
        // Load the data
        DataSource.load().then(items => {
            // Render the dashboard
            this.render(el, items);
        });
    }

    // Creates the filter item
    private createFilterItem(header: string, items: any[], filterIdx: number): IFilterItem {
        // Return the filter items
        return {
            header,
            items,
            onFilter: (value: string) => {
                // Filter the table
                this._dashboard.filter(filterIdx, value);
            }
        };
    }

    // Gets the filters for the dashboard
    private getFilters(): IFilterItem[] {
        let filterItems: IFilterItem[] = [];

        // Parse the filters
        let filters = DataSource.getFilters();
        for (let key in filters) {
            let filter = filters[key];

            // Append the filter
            filterItems.push(this.createFilterItem(filter.text, filter.items, filter.filterIdx));
        }

        // Return the filter items
        return filterItems;
    }

    // Renders the dashboard
    private render(el: HTMLElement, items: any[]) {
        // Create the dashboard
        this._dashboard = new Dashboard({
            el,
            header: {
                title: Strings.ProjectName
            },
            filters: {
                items: this.getFilters()
            },
            navigation: {
                title: Strings.ProjectName
            },
            footer: {
                itemsEnd: [
                    {
                        text: Strings.Version
                    }
                ]
            },
            table: {
                rows: items,
                dtProps: {
                    dom: 'rt<"row"<"col-sm-4"l><"col-sm-4"i><"col-sm-4"p>>'
                },
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
                                    isSmall: true,
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
                        name: "releaseDate",
                        title: "Release Date",
                    },
                    {
                        name: "addedToRoadmap",
                        title: "Date Added",
                    }
                ]
            }
        });

        // Set the default filter
        this._dashboard.setFilterValue("By Cloud Env", "DoD");
    }
}