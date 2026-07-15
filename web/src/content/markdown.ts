function sectionId(heading: string, position: number): string {
  const slug = heading
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return slug || `section-${position + 1}`;
}

export function parseSections(
  markdown: string,
): Array<{ id: string; heading: string }> {
  const sections: Array<{ id: string; heading: string }> = [];
  const counts = new Map<string, number>();

  for (const line of markdown.split(/\r?\n/)) {
    const match = /^(?:#{1,6})\s+(.+?)\s*#*\s*$/.exec(line);
    if (!match) continue;
    const heading = match[1].trim();
    const baseId = sectionId(heading, sections.length);
    const count = (counts.get(baseId) ?? 0) + 1;
    counts.set(baseId, count);
    sections.push({
      id: count === 1 ? baseId : `${baseId}-${count}`,
      heading,
    });
  }

  return sections;
}
