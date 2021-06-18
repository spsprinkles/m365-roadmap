import { Components, ContextInfo } from "gd-sprest-bs";
import Strings from "./strings";

// Filters
export interface IFilter {
    text: string, items: Components.ICheckboxGroupItem[], values: object
}
export interface IFilters { [key: string]: IFilter }

// Item
export interface IItem {
    addedToRoadmap: string;
    cloudInstance: string;
    description: string;
    feature: string;
    featureId: string;
    lastModified: string;
    link: string;
    product: string;
    productTags: string;
    release: string;
    status: string;
}

// CSV Column Mapper
const Mapper = {
    addedToRoadmap: "Added to Roadmap",
    cloudInstance: "Tags - Cloud Instance",
    description: "Details",
    feature: "Description",
    featureId: "Feature ID",
    lastModified: "Last Modified",
    link: "More Info",
    product: "Description",
    productTags: "Tags - Products",
    release: "Tags - Release Phase",
    status: "Status"
}

/**
 * Data Source
 */
export class DataSource {
    private static _data: Array<IItem> = null;

    // Gets the filters
    static getFilters(): IFilters {
        // Set the filters
        let filters: IFilters = {
            "Product": { text: "By Product", items: [], values: {} },
            "Release": { text: "By Release", items: [], values: {} },
            "Status": { text: "By Status", items: [], values: {} },
            "Cloud": { text: "By Cloud Env", items: [], values: {} }
        };

        // Parse the items
        for (let i = 0; i < this._data.length; i++) {
            let item = this._data[i];

            // Parse the cloud instances
            let instances = item.cloudInstance.split(',');
            for (let i = 0; i < instances.length; i++) {
                let instance = instances[i].trim();

                // Add the cloud
                filters.Cloud.values[instance] = true;
            }

            // Add the product
            filters.Product.values[item.product] = true;

            // Parse the releases
            let releases = item.release.split(',');
            for (let i = 0; i < releases.length; i++) {
                let release = releases[i].trim();

                // Add the release
                filters.Release.values[release] = true;
            }

            // Add the status
            filters.Status.values[item.status] = true;
        }

        // Parse the filters
        for (let key in filters) {
            let filter = filters[key];

            // Parse the unique values
            let filterNames = [];
            for (var value in filter.values) {
                // Add the filter
                value ? filterNames.push(value) : null;
            }

            // Sort the filters
            filterNames = filterNames.sort();

            // Parse the values
            for (let i = 0; i < filterNames.length; i++) {
                let filterName = filterNames[i];

                // Add the item
                filter.items.push({
                    data: key,
                    label: filterName,
                    type: Components.CheckboxGroupTypes.Switch
                });
            }
        }

        // Return the filters
        return filters;
    }

    static load(): PromiseLike<Array<IItem>> {
        // Return a promise
        return new Promise((resolve) => {
            // Read the file from the static location
            let xhr = new XMLHttpRequest();

            // Create the async request
            xhr.open("GET", [ContextInfo.webServerRelativeUrl, Strings.SolutionUrl].join('/'), true);

            // Add the load event
            xhr.onreadystatechange = () => {
                // Ensure it's complete
                if (xhr.readyState == XMLHttpRequest.DONE) {
                    // Resolve the request
                    resolve(this.parse(xhr.response.split('\n')));
                }
            }

            // Send the request
            xhr.send();
        });
    }

    // Converts the rss feed xml to an array
    private static parse(csv: Array<string>) {
        let items: Array<IItem> = [];
        let colIdx = {};

        // Parse the header row
        let headers = csv[0].split(',');
        for (let i = 0; i < headers.length; i++) {
            let header = headers[i];

            // Parse the keys
            for (let key in Mapper) {
                if (Mapper[key] == header) {
                    // Set the index
                    colIdx[key] = i;
                }
            }
        }

        // Parse the data
        for (let i = 1; i < csv.length; i++) {
            let row = csv[i];
            let values = row.substr(1, row.length - 2).split('","');

            // Validate the values
            if (values.length != headers.length) { continue; }

            // Create an empty item
            let item: IItem = {
                addedToRoadmap: "",
                cloudInstance: "",
                description: "",
                feature: "",
                featureId: "",
                lastModified: "",
                link: "",
                product: "",
                productTags: "",
                release: "",
                status: "",
            };

            // Parse the mapper
            for (let key in Mapper) {
                // Update the item
                item[key] = values[colIdx[key]].trim();
            }

            // Update the feature
            let idx = item.feature.indexOf(":");
            item.feature = item.feature.substr(idx + 1).trim();

            // Update the product
            item.product = item.product.split(':')[0].trim();

            // Add the item
            items.push(item);
        }

        // Set the data
        this._data = items;

        // Return the data
        return this._data;
    }

    // Waits for the data to be loaded
    static waitUntilLoaded(): PromiseLike<void> {
        // Return a promise
        return new Promise(resolve => {
            let id = setInterval(() => {
                // See if the data exists
                if (this._data) { clearInterval(id); resolve(); }
            }, 10);
        });
    }
}