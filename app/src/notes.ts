import type { Problem, Subject } from './data'

// Turn pasted notes into flashcards without AI: each line like
// "Term: definition", "Term - definition", or "Question? Answer"
// becomes a card. This is the hook where the AI generator plugs in later.
export function parseNotes(text: string, subject: Subject): Problem[] {
  const problems: Problem[] = []
  for (const rawLine of text.split('\n')) {
    const line = rawLine.trim().replace(/^[-*•]\s+/, '')
    if (!line) continue
    let q = ''
    let a = ''
    const qMark = line.indexOf('?')
    const sep = line.match(/\s*(?::|—|–| - )\s*/)
    if (sep && sep.index !== undefined && sep.index > 0) {
      q = line.slice(0, sep.index).trim()
      a = line.slice(sep.index + sep[0].length).trim()
    } else if (qMark > 0 && qMark < line.length - 1) {
      q = line.slice(0, qMark + 1).trim()
      a = line.slice(qMark + 1).trim()
    }
    if (q && a) {
      problems.push({
        subject,
        question: q,
        steps: [{ title: 'Answer', body: a, text: true }],
        answer: a,
        answerIsText: true,
      })
    }
  }
  return problems
}
