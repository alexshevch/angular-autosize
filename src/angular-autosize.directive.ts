import { Directive, AfterContentInit, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[autosize]'
})
export class AutosizeDirective implements AfterContentInit {
@HostListener('mouseup')
@HostListener('input') onInput() {
  // Run a check on new input or potential element resizing 
  this.autosize();
}

  private textarea: HTMLTextAreaElement;

  constructor(private elementRef: ElementRef) {
    this.textarea = elementRef.nativeElement;
  }

  ngAfterContentInit() {
    // Run an initial check after content has been initialized
    this.autosize();
  }

  /* 
    Automatically adjust textarea height to its content
    while preserving element width
  */
  private autosize() {
    this.textarea.style.cssText = `
      height: auto;
      padding: 0;
      width: ${this.textarea.style.width};
    `;
    this.textarea.style.cssText = `
      height: ${this.textarea.scrollHeight}px;
      width: ${this.textarea.style.width};
    `;
  }
}
