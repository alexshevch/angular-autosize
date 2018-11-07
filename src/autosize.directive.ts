/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 * Copyright Alex Shevchenko.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import { Directive, ElementRef, HostBinding, HostListener, Input, AfterViewInit, Optional, Self } from '@angular/core';
import { NgControl } from '@angular/forms';


/**
 * Directive to automatically resize a textarea to fit its content.
 */
@Directive({
  selector: 'textarea[textareaAutosize],' +
            'textarea[autosize]',
  exportAs: 'TextareaAutosize',
})
export class AutosizeDirective implements AfterViewInit {
  /** Keep track of the previous textarea value to avoid resizing when the value hasn't changed. */
  private _previousValue: string;

  private _minRows: number;
  private _maxRows: number;

  /** Cached height of a textarea with a single row. */
  private _cachedLineHeight: number;

  private _cachedBorder: number;

  // Textarea elements that have the directive applied should have a single row by default.
  // Browsers normally show two rows by default and therefore this limits the minRows binding.
  @HostBinding('attr.rows') '1';

  @HostListener('input') onTextareaInput() {
    this.resizeToFitContent();
  }

  @Input('autosizeMinRows')
  get minRows() { return this._minRows; }

  set minRows(value: number) {
    this._minRows = value;
    this._setMinHeight();
  }

  @Input('autosizeMaxRows')
  get maxRows() { return this._maxRows; }

  set maxRows(value: number) {
    this._maxRows = value;
    this._setMaxHeight();
  }

  constructor(private _elementRef: ElementRef, @Optional() @Self() formControl: NgControl) {
    if (formControl && formControl.valueChanges) {
      formControl.valueChanges.subscribe(() => this.resizeToFitContent());
    }
  }

  /** Sets the minimum height of the textarea as determined by minRows. */
  _setMinHeight(): void {
    const minHeight = this.minRows && this._cachedLineHeight ?
        `${this.minRows * this._cachedLineHeight}px` : null;

    if (minHeight) {
      this._setTextareaStyle('minHeight', minHeight);
    }
  }

  /** Sets the maximum height of the textarea as determined by maxRows. */
  _setMaxHeight(): void {
    const maxHeight = this.maxRows && this._cachedLineHeight ?
        `${this.maxRows * this._cachedLineHeight}px` : null;

    if (maxHeight) {
      this._setTextareaStyle('maxHeight', maxHeight);
    }
  }

  ngAfterViewInit() {
    this._cacheTextareaLineHeight();
    this.resizeToFitContent();
  }

  /** Sets a style property on the textarea element. */
  private _setTextareaStyle(property: string, value: string): void {
    const textarea = this._elementRef.nativeElement as HTMLTextAreaElement;
    textarea.style[property] = value;
  }

  /**
   * Cache the height of a single-row textarea.
   *
   * We need to know how large a single "row" of a textarea is in order to apply minRows and
   * maxRows. For the initial version, we will assume that the height of a single line in the
   * textarea does not ever change.
   */
  private _cacheTextareaLineHeight(): void {
    const textarea = this._elementRef.nativeElement as HTMLTextAreaElement;

    // Use a clone element because we have to override some styles.
    const textareaClone = textarea.cloneNode(false) as HTMLTextAreaElement;
    textareaClone.rows = 1;

    // Use `position: absolute` so that this doesn't cause a browser layout and use
    // `visibility: hidden` so that nothing is rendered. Clear any other styles that
    // would affect the height.
    textareaClone.style.position = 'absolute';
    textareaClone.style.visibility = 'hidden';
    textareaClone.style.border = 'none';
    textareaClone.style.padding = '0';
    textareaClone.style.height = '';
    textareaClone.style.minHeight = '';
    textareaClone.style.maxHeight = '';

    textarea.parentNode!.appendChild(textareaClone);
    this._cachedLineHeight = textareaClone.clientHeight;
    textarea.parentNode!.removeChild(textareaClone);

    // Calculate the border to take it into account when setting height
    const style = getComputedStyle(textarea);

    const borderTop = Number(style.getPropertyValue('border-top-width')
      .replace('px', '')) || 0;
    const borderBottom = Number(style.getPropertyValue('border-bottom-width')
      .replace('px', '')) || 0;

    this._cachedBorder = borderTop + borderBottom;

    // Min and max heights have to be re-calculated if the cached line height changes
    this._setMinHeight();
    this._setMaxHeight();
  }

  /** Resize the textarea to fit its content. */
  resizeToFitContent() {
    const textarea = this._elementRef.nativeElement as HTMLTextAreaElement;
    if (textarea.value === this._previousValue) {
      return;
    }

    // Reset the textarea height to auto in order to shrink back to its default size.
    textarea.style.height = 'auto';

    // Use the scrollHeight to know how large the textarea *would* be if fit its entire value.
    textarea.style.height = `${textarea.scrollHeight + this._cachedBorder}px`;

    this._previousValue = textarea.value;
  }
}
