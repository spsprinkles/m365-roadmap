import { ContextInfo, Helper } from "gd-sprest-bs";

/**
 * Global Constants
 */

// Global Path
let AssetsUrl: string = ContextInfo.webServerRelativeUrl + "/SiteAssets/";
let SPFxContext: { pageContext: any; sdks: { microsoftTeams: any } } = null;

// Updates the strings for SPFx
export const setContext = (context, sourceUrl?: string) => {
    // Set the page context
    SPFxContext = context;
    ContextInfo.setPageContext(SPFxContext.pageContext);

    // Set the teams flag
    Strings.IsTeams = SPFxContext.sdks.microsoftTeams ? true : false;

    // Update the global path
    Strings.SourceUrl = sourceUrl || ContextInfo.webServerRelativeUrl;
    AssetsUrl = Strings.SourceUrl + "/SiteAssets/";
    Strings.CSVUrl = AssetsUrl + "m365-roadmap/Microsoft365RoadMap_Features.csv";
    Strings.SourceUrl = AssetsUrl + "m365-roadmap/m365-roadmap.min.js";

    // Update the values
    Strings.SolutionUrl = AssetsUrl + "index.html";
}

// Strings
const Strings = {
    AppElementId: "m365-roadmap",
    CSVUrl: ContextInfo.webServerRelativeUrl + "/SiteAssets/m365-roadmap/Microsoft365RoadMap_Features.csv",
    GlobalVariable: "M365Roadmap",
    IsTeams: false,
    ProjectDescription: "Displays the M365 Roadmap in a datatable.",
    ProjectName: "M365 Roadmap",
    SolutionUrl: ContextInfo.webServerRelativeUrl,
    SourceUrl: ContextInfo.webServerRelativeUrl + "/Sitessets/m365-roadmap/m365-roadmap.min.js",
    Version: "0.1",
};
export default Strings;