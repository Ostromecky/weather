import {computed, inject, Injectable, signal} from '@angular/core';
import {BreakpointObserver, Breakpoints} from "@angular/cdk/layout";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
import {Layout} from "./types";
import {debounceTime} from "rxjs";

type Helper = typeof Breakpoints;
type BreakpointHelper = {
  [K in keyof Helper]: `${Helper[K]}`;
}[keyof Helper];


@UntilDestroy()
@Injectable()
export class LayoutService {
  private currentScreenSize = signal<Layout>('Unknown');
  private breakpointObserver: BreakpointObserver = inject(BreakpointObserver);
  private displayNameMap = new Map<BreakpointHelper, Layout>([
    [Breakpoints.Handset, 'Handset'],
    [Breakpoints.HandsetPortrait, 'Handset'],
    [Breakpoints.HandsetLandscape, 'Handset'],
    [Breakpoints.Tablet, 'Tablet'],
    [Breakpoints.TabletPortrait, 'Tablet'],
    [Breakpoints.TabletLandscape, 'Tablet'],
    [Breakpoints.Web, 'Web'],
    [Breakpoints.WebPortrait, 'Web'],
    [Breakpoints.WebLandscape, 'Web'],
  ]);
  screenSize = computed(() => this.currentScreenSize());

  constructor() {
    this.breakpointObserver
      .observe([
        Breakpoints.HandsetPortrait,
        Breakpoints.Handset,
        Breakpoints.HandsetLandscape,
        Breakpoints.TabletPortrait,
        Breakpoints.Tablet,
        Breakpoints.TabletLandscape,
        Breakpoints.Web,
        Breakpoints.WebPortrait,
        Breakpoints.WebLandscape,
      ])
      .pipe(debounceTime(50), untilDestroyed(this))
      .subscribe(result => {
        for (const query of Object.keys(result.breakpoints)) {
          if (result.breakpoints[query]) {
            this.currentScreenSize.set(this.displayNameMap.get(query) ?? 'Unknown');
            console.log(this.screenSize())
          }
        }
      });
  }
}
