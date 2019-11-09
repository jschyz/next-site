import unified from 'unified';
import markdown from 'remark-parse';
import remarkToRehype from 'remark-rehype';
import raw from 'rehype-raw';
import sanitize from 'rehype-sanitize';
import prism from '@mapbox/rehype-prism';
import html from 'rehype-stringify';
// https://github.com/syntax-tree/hast-util-sanitize/blob/master/lib/github.json
import githubSchema from 'hast-util-sanitize/lib/github';
import docs from './rehype-docs';
import { REPO_URL } from './github-constants';

// Allow className for all elements
githubSchema.attributes['*'].push('className');

const handlers = {
  // Add a class to inlineCode so we can differentiate between it and code fragments
  inlineCode(h, node) {
    return {
      ...node,
      type: 'element',
      tagName: 'code',
      properties: { className: 'inline' },
      children: [
        {
          type: 'text',
          value: node.value
        }
      ]
    };
  }
};

// Create the processor, the order of the plugins is important
const processor = unified()
  .use(markdown)
  .use(remarkToRehype, { handlers, allowDangerousHTML: true })
  // Add custom HTML found in the markdown file to the AST
  .use(raw)
  // Sanitize the HTML
  .use(sanitize, githubSchema)
  // Apply our custom plugin to the sanitized HTML
  .use(docs, { repoUrl: REPO_URL })
  // Add syntax highlighting
  .use(prism)
  .use(html);

export default async function markdownToHtml(md) {
  try {
    const file = await processor.process(md);
    return file.contents;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`Markdown to HTML error: ${error}`);
    throw error;
  }
}
