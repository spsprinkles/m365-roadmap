import { Components } from "gd-sprest-bs";
import { CanvasForm } from "../common";
import { DataSource, IFilter, IFilters } from "../ds";

/**
 * Properties
 */
interface IProps {
    onFilterCloud: (value: string) => void;
    onFilterProduct: (value: string) => void;
    onFilterRelease: (value: string) => void;
    onFilterStatus: (value: string) => void;
}

/**
 * Filter Slideout
 */
export class FilterSlideout {
    private _cbs: { [key: string]: Components.ICheckboxGroup } = null;
    private _el: HTMLElement = null;
    private _items: Array<Components.IAccordionItem> = null;
    private _props: IProps = null;

    constructor(props: IProps) {
        // Save the properties
        this._props = props;

        // Initialize the variables
        this._cbs = {};
        this._items = [];

        // Wait for the data to be loaded
        DataSource.waitUntilLoaded().then(() => {
            // Generate the items
            this.generateFilters(DataSource.getFilters());

            // Default the filter to the DoD Environment
            this._cbs["By Cloud Env"].setValue("DoD");
        });
    }

    // Generates the filters
    private generateFilters(filters: IFilters) {
        // Create the filters element
        this._el = document.createElement("div");

        // Render a clear button
        Components.Button({
            el: this._el,
            className: "mb-3",
            text: "Clear Filters",
            type: Components.ButtonTypes.OutlineDanger,
            onClick: () => {
                // Parse the filters
                for (let key in this._cbs) {
                    // Clear the filter
                    this._cbs[key].setValue("");
                }
            }
        });

        // Parse the filters
        for (let key in filters) {
            // Add the filter
            this._items.push(this.generateItem(filters[key]));
        }

        // Default the first filter to be displayed
        this._items[0].showFl = true;

        // Render an accordion
        Components.Accordion({
            el: this._el,
            items: this._items
        });
    }

    // Generates the navigation dropdown items
    private generateItem(filter: IFilter) {
        // Create the item
        let item: Components.IAccordionItem = {
            header: filter.text,
            onRender: el => {
                // Render the checkbox group
                this._cbs[filter.text] = (Components.CheckboxGroup({
                    el,
                    items: filter.items,
                    onChange: (item: Components.ICheckboxGroupItem) => {
                        // Filter based on the type
                        let filterType = item ? item.data : "";
                        switch (filterType) {
                            // Cloud
                            case "Cloud":
                                this._props.onFilterCloud(item.label);
                                break;

                            // Product
                            case "Product":
                                this._props.onFilterProduct(item.label);
                                break;

                            // Release
                            case "Release":
                                this._props.onFilterRelease(item.label);
                                break;

                            // Status
                            case "Status":
                                this._props.onFilterStatus(item.label);
                                break;

                            // Default - Clear the filter
                            default:
                                switch (filter.text) {
                                    // Cloud
                                    case "By Cloud":
                                        this._props.onFilterCloud("");
                                        break;

                                    // Product
                                    case "By Product":
                                        this._props.onFilterProduct("");
                                        break;

                                    // Release
                                    case "By Release":
                                        this._props.onFilterRelease("");
                                        break;

                                    // Status
                                    case "By Status":
                                        this._props.onFilterStatus("");
                                        break;
                                }
                                break;
                        }
                    }
                }));
            }
        };

        // Return the item
        return item;
    }

    // Shows the filters
    show() {
        // Set the header and body
        CanvasForm.setHeader("Filters");
        CanvasForm.setBody(this._el || "<p>Loading the Filters...</p>");

        // Show the filters
        CanvasForm.show();
    }
}