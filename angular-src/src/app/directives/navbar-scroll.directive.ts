import {Directive, ElementRef, HostListener, Input, Renderer2} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';

@Directive({
  selector: '[appNavbarScroll]'
})
export class NavbarScrollDirective {
  @Input() className = 'scrolled-past';
  offsetYTolerance = 5;
  private _currentOffset = 0;
  path: any;

  constructor(private elRef: ElementRef,
              private renderer: Renderer2,
              private router: Router) {
    this.router.events.filter((event) => event instanceof NavigationEnd).subscribe(data => {
      this.windowScrolled(window);
    });
  }

  @HostListener('window:scroll', ['$event'])
  windowScrolled($event: any) {
    let offsetY;
    if ($event === window) {
      offsetY = window.scrollY;
    } else {
      this.path = $event.path || ($event.composedPath && $event.composedPath()) || this.composedPath($event.target);
      if (this.path.length <= 2) {
        if (this.path.length === 1) {
          offsetY = this.path[0].scrollY;
        } else {
          offsetY = this.path[1].scrollY;
        }
      } else {
        offsetY = this.path[2].scrollY;
      }
    }

    if (offsetY > this.offsetYTolerance && this._currentOffset < this.offsetYTolerance) {
      this._currentOffset = offsetY;
      this.renderer.addClass(this.elRef.nativeElement, this.className);
    } else if (offsetY < this.offsetYTolerance && this._currentOffset > this.offsetYTolerance) {
      // remove the class
      this._currentOffset = offsetY;
      this.renderer.removeClass(this.elRef.nativeElement, this.className);
    }
  }

  composedPath(element) {
    const path = [];
    while (element) {
      path.push(element);
      if (element.firstElementChild.tagName === 'HTML') {
        path.push(document);
        path.push(window);
        return path;
      }
      element = element.parentElement;
    }
  }
}
