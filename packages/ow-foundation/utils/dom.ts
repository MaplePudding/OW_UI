export default function isHTMLElement(obj: any) {
  try {
    return obj instanceof HTMLElement;
  } catch (e) {
    return (
      typeof obj === 'object'
      && obj.nodeType === 1
      && typeof obj.style === 'object'
      && typeof obj.ownerDocument === 'object'
    );
  }
}

/* eslint-disable */
export type DOMRectLikeType = {
  [key in 'left' | 'top' | 'right' | 'bottom' | 'width' | 'height']?: number;
};

export function convertDOMRectToObject(domRect: DOMRect): DOMRectLikeType {
  if (domRect && typeof domRect === 'object') {
    if (typeof domRect.toJSON === 'function') {
      return domRect.toJSON();
    }
    const keys = ['left', 'top', 'right', 'bottom', 'width', 'height'] as const;

    return keys.reduce((obj, key) => {
      /* eslint-disable */
      obj[key] = domRect[key];
      return obj;
    }, {} as DOMRectLikeType);
  }
  return undefined;
}
