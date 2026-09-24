export default function topicHeadings() {
  return (tree, file) => {
    const topic = file.path?.replaceAll('\\', '/').match(/\/content\/topics\/(.+)\.md$/)?.[1];
    if (!topic) return;
    const headingIds = new Map();
    const used = new Set();
    const content = node => node.value || (node.children || []).map(content).join('');
    const visit = (node, action) => {
      action(node);
      for (const child of node.children || []) visit(child, action);
    };

    visit(tree, node => {
      if (node.type !== 'element' || !/^h[1-6]$/.test(node.tagName)) return;
      const properties = node.properties ||= {};
      const base = String(properties.id || content(node).toLowerCase().replace(/[^\p{L}\p{N}\s_-]/gu, '').trim().replace(/\s+/g, '-') || 'section');
      let slug = base;
      let suffix = 1;
      while (used.has(slug)) slug = `${base}-${suffix++}`;
      used.add(slug);
      const id = `${topic.replaceAll('/', '-')}-${slug}`;
      headingIds.set(slug, id);
      properties.id = id;
      node.tagName = `h${Math.min(6, Math.max(3, Number(node.tagName[1]) + 1))}`;
    });

    visit(tree, node => {
      const href = node.properties?.href;
      if (node.tagName === 'a' && typeof href === 'string' && href.startsWith('#') && headingIds.has(href.slice(1))) {
        node.properties.href = `#${headingIds.get(href.slice(1))}`;
      }
    });
  };
}
