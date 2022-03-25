import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { escape } from '@microsoft/sp-lodash-subset';

import styles from './M365RoadmapWebPart.module.scss';
import * as strings from 'M365RoadmapWebPartStrings';

import "../../../../dist/m365-roadmap.js";
declare var M365Roadmap;

export interface IM365RoadmapWebPartProps {
  csvUrl: string;
}

export default class M365RoadmapWebPart extends BaseClientSideWebPart<IM365RoadmapWebPartProps> {

  public render(): void {
    // Render the element
    M365Roadmap.render(this.domElement, this.context.pageContext, this.properties.csvUrl);
  }

  protected get dataVersion(): Version { return Version.parse('1.0'); }

  protected get disableReactivePropertyChanges(): boolean { return true; }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          groups: [
            {
              groupFields: [
                PropertyPaneTextField('csvUrl', { label: strings.CSVUrlFieldLabel })
              ]
            }
          ]
        }
      ]
    };
  }
}
