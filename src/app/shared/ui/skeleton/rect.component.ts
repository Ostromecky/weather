import {ChangeDetectionStrategy, Component, ElementRef, OnInit} from "@angular/core";

@Component({
  selector: 'skeleton-rect',
  host: {
    'class': 'pulse'
  },
  template: ``,
  styleUrls: ['./rect.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RectComponent implements OnInit {
  width: string | undefined;
  height: string | undefined
  className: string | undefined

  constructor(private host: ElementRef<HTMLElement>) {
  }

  ngOnInit() {
    const host = this.host.nativeElement;

    if (this.className) {
      host.classList.add(this.className);
    }

    host.style.setProperty('--skeleton-rect-width', this.width ?? '100%');
    host.style.setProperty('--skeleton-rect-height', this.height ?? '20px');
  }
}
