export interface LessonSelection {
  text: string;
  sectionHeading: string;
  originalCharacterCount: number;
  sentCharacterCount: number;
  truncated: boolean;
  rect: {
    top: number;
    right: number;
    bottom: number;
    left: number;
    width: number;
    height: number;
  };
}

const headingSelector = "h1, h2, h3, h4, h5, h6";

function nearestHeading(root: Element, anchor: Node): string {
  const anchorElement =
    anchor.nodeType === Node.ELEMENT_NODE
      ? (anchor as Element)
      : anchor.parentElement;
  if (!anchorElement) return "";

  const containingHeading = anchorElement.closest(headingSelector);
  if (containingHeading && root.contains(containingHeading)) {
    return containingHeading.textContent?.trim() ?? "";
  }

  let result = "";
  for (const heading of root.querySelectorAll(headingSelector)) {
    if (
      heading === anchorElement ||
      heading.compareDocumentPosition(anchorElement) &
        Node.DOCUMENT_POSITION_FOLLOWING
    ) {
      result = heading.textContent?.trim() ?? result;
      continue;
    }
    break;
  }
  return result;
}

export function extractLessonSelection(
  root: Element,
  selection: Selection | null,
  maximumCharacters = 4000,
): LessonSelection | null {
  if (!selection || selection.isCollapsed || selection.rangeCount === 0) {
    return null;
  }

  const range = selection.getRangeAt(0);
  if (
    !root.contains(range.startContainer) ||
    !root.contains(range.endContainer)
  ) {
    return null;
  }

  const normalized = selection.toString().replace(/\r\n?/g, "\n").trim();
  if (!normalized) return null;

  const characters = Array.from(normalized);
  const sentCharacters = characters.slice(0, maximumCharacters);
  const bounds = range.getBoundingClientRect();

  return {
    text: sentCharacters.join(""),
    sectionHeading: nearestHeading(root, range.startContainer),
    originalCharacterCount: characters.length,
    sentCharacterCount: sentCharacters.length,
    truncated: characters.length > sentCharacters.length,
    rect: {
      top: bounds.top,
      right: bounds.right,
      bottom: bounds.bottom,
      left: bounds.left,
      width: bounds.width,
      height: bounds.height,
    },
  };
}
