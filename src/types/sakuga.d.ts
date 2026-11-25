import React from "react";

export interface SakugaButtonElement extends HTMLElement {
  done: () => void;
  disabled?: boolean;
}

export interface SakugaToggleElement extends HTMLElement {
  checked: boolean;
}

export interface SakugaSliderElement extends HTMLElement {
  value: number | string;
}

export interface SakugaCheckboxElement extends HTMLElement {
  checked: boolean;
}

export interface SakugaRadioElement extends HTMLElement {
  value: string;
}

export interface SakugaInputElement extends HTMLElement {
  value: string;
}

export interface SakugaTabsElement extends HTMLElement {
  selected: number;
}

export interface SakugaProgressElement extends HTMLElement {
  set: (n: number, instant?: boolean) => void;
  reset: () => void;
}

export interface SakugaRatingElement extends HTMLElement {
  value: number;
}

export interface SakugaToastElement extends HTMLElement {
  show: (message: string) => void;
  hide: () => void;
}

export interface SakugaTooltipElement extends HTMLElement {}

type CustomElementProps<T extends HTMLElement = HTMLElement> = React.DetailedHTMLProps<
  React.HTMLAttributes<T>,
  T
> &
  Record<string, any>;

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "sakuga-button": CustomElementProps<SakugaButtonElement>;
      "sakuga-toggle": CustomElementProps<SakugaToggleElement>;
      "sakuga-slider": CustomElementProps<SakugaSliderElement>;
      "sakuga-checkbox": CustomElementProps<SakugaCheckboxElement>;
      "sakuga-radio": CustomElementProps<SakugaRadioElement>;
      "sakuga-input": CustomElementProps<SakugaInputElement>;
      "sakuga-tabs": CustomElementProps<SakugaTabsElement>;
      "sakuga-progress": CustomElementProps<SakugaProgressElement>;
      "sakuga-rating": CustomElementProps<SakugaRatingElement>;
      "sakuga-toast": CustomElementProps<SakugaToastElement>;
      "sakuga-tooltip": CustomElementProps<SakugaTooltipElement>;
      "like-button": CustomElementProps<HTMLElement>;
    }
  }
}
