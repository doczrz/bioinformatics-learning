function sectionId(heading: string, position: number): string {
  const slug = heading
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return slug || `section-${position + 1}`;
}

export function parseSections(markdown: string) {
  const sections: Array<{ id: string; heading: string; line: number; level: number }> = [];
  const counts = new Map<string, number>();
  let fence = "";

  for (const [index, line] of markdown.split(/\r?\n/).entries()) {
    const marker = /^ {0,3}(`{3,}|~{3,})(.*)$/.exec(line);
    if (fence) {
      if (marker && marker[1].startsWith(fence) && !marker[2].trim()) fence = "";
      continue;
    }
    if (marker) {
      fence = marker[1];
      continue;
    }
    const match = /^ {0,3}(#{1,6})[\t ]+(.+?)\s*$/.exec(line);
    if (!match) continue;
    const heading = match[2].replace(/[\t ]+#+$/, "").trim();
    const baseId = sectionId(heading, sections.length);
    const count = (counts.get(baseId) ?? 0) + 1;
    counts.set(baseId, count);
    sections.push({
      id: count === 1 ? baseId : `${baseId}-${count}`,
      heading,
      line: index + 1,
      level: match[1].length,
    });
  }

  return sections;
}
