import { Injectable } from '@angular/core';
import algoliasearch from 'algoliasearch/lite';
import { IndexWidget, Widget } from 'instantsearch.js';
import history from 'instantsearch.js/es/lib/routers/history';
import InstantSearch from 'instantsearch.js/es/lib/InstantSearch';
import { Router } from '@angular/router';

const searchClient = algoliasearch('RT2TQ11LVE', '6c04ffc0acc45a184c69d0d38d0dca73');

@Injectable()
export class InstantSearchService {
  public instantSearchInstance: InstantSearch;

  constructor(router: Router) {
    this.instantSearchInstance = new InstantSearch({
      searchClient,
      indexName: 'cities',
      future: { preserveSharedStateOnUnmount: true },
      routing: {
        router: history({
          getLocation: () => {
            if (typeof window === 'undefined') {
              // no other way to get this in constructor
              return new URL(
                router['location']._locationStrategy._platformLocation.href
              ) as unknown as Location;
            }
            return window.location;
          },
          cleanUrlOnDispose: false,
        }),
      },
    });
  }

  start() {
    this.instantSearchInstance.start();
  }

  dispose() {
    this.instantSearchInstance.dispose();
  }

  addWidgets(widgets: Array<Widget | IndexWidget>) {
    this.instantSearchInstance.addWidgets(widgets);
  }

  removeWidgets(widgets: Array<Widget | IndexWidget>) {
    this.instantSearchInstance.removeWidgets(widgets);
  }
}
