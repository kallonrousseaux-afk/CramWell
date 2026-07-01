import katex from 'katex'
import 'katex/dist/katex.min.css'

export function TeX({ src, block = false }: { src: string; block?: boolean }) {
  const html = katex.renderToString(src, {
    displayMode: block,
    throwOnError: false,
  })
  return block ? (
    <div style={{ overflowX: 'auto', padding: '4px 0' }} dangerouslySetInnerHTML={{ __html: html }} />
  ) : (
    <span dangerouslySetInnerHTML={{ __html: html }} />
  )
}
