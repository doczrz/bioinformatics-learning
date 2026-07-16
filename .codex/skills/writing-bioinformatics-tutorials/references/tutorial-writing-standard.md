# Tutorial writing standard

## Audience contract

Assume the learner knows high-school biology but has no prior experience with bioinformatics, sequencing platforms, statistics, Linux, R, Python, command-line tools, or research computing. Never treat an unexplained technical term as prior knowledge.

The goal is not to display the most information. The goal is to let a beginner understand what a method is for, follow a standard workflow, judge whether a step succeeded, and know what to inspect when it fails.

## Recommended teaching sequence

Adapt the sequence to the lesson, but normally cover these elements in order:

1. **The problem:** What biological or analytical question are we trying to solve?
2. **Prerequisites:** What must the learner already have or understand for this section?
3. **Intuition:** Explain the central idea in ordinary language before terminology or commands.
4. **Workflow position:** Show what comes before this step and what its output enables next.
5. **Procedure:** Break the work into small, numbered actions.
6. **Inputs, outputs, and success:** Name the files or objects entering and leaving the step and show how success is recognized.
7. **Interpretation:** Explain what the result means biologically and what it does not prove.
8. **Common failures:** Describe likely symptoms, causes, and a useful diagnostic order.
9. **Checkpoint:** Give the learner a small question or observable result that confirms understanding.
10. **Next step:** Connect the section to the following part of the course.

Not every short conceptual section needs all ten headings. The lesson as a whole should still supply these functions.

## Writing rules

- Define a technical term on first use, then use it consistently. Introduce the Chinese term and common English name or abbreviation when the learner will encounter both.
- Explain why a step exists before explaining how to perform it.
- Use short paragraphs and one main idea per paragraph.
- Introduce only concepts needed for the current learning goal. Move deeper detail into a clearly marked optional note or a later lesson.
- An analogy must be followed by its boundary: state where the comparison stops being biologically or technically accurate.
- Historical material should explain why a method emerged and what problem it solved, not become a list of dates and names.
- Reorder rough source text when that improves learning, while preserving the author's intended claims and scope.
- Separate established facts from simplifications, practical conventions, and the author's judgment.
- Cite primary papers for scientific firsts and method claims; use official documentation for current platform or software behavior. Do not invent precise numbers when no reliable source supports them.
- Avoid language that equates jargon density with rigor. Accuracy and accessibility must coexist.

## Practical sections

When a lesson contains commands or code, include only what the learner needs for the stated task and explain:

- where the command runs;
- what each important argument means;
- expected input files;
- expected output files or directories;
- a short example of successful output;
- one or two common failure messages and what to check first;
- commands that may overwrite data, consume substantial compute, or require credentials.

Do not present an unexplained code block as a procedure.

## Example of beginner-facing explanation

Weak: “Use UMI deduplication before constructing the expression matrix.”

Stronger: “A unique molecular identifier (UMI) is a short sequence attached to an RNA molecule before amplification. If amplification creates many copies of the same original molecule, reads with the same cell barcode, gene, and UMI can usually be counted as one captured molecule. This reduces PCR-copy inflation, although sequencing or UMI errors can still complicate the count.”

The stronger version defines the term, explains the problem it solves, and marks the limit of the simplification.
