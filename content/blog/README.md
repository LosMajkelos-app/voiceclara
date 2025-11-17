# VoiceClara Blog System

Simple, free markdown-based blog system. No CMS required!

## How It Works

Blog posts are stored as Markdown files in `/content/blog/`. Next.js statically generates pages at build time.

## Adding a New Blog Post

### Step 1: Create a Markdown File

Create a new file in `/content/blog/your-post-slug.md`

**Example:** `/content/blog/5-tips-for-better-feedback.md`

### Step 2: Add Frontmatter

At the top of your markdown file, add metadata:

```markdown
---
title: "5 Tips for Better Feedback"
date: "2025-01-18"
excerpt: "Learn how to give and receive feedback more effectively with these proven strategies."
author: "VoiceClara Team"
image: "/blog/feedback-tips.jpg"
---

# Your Post Content Starts Here

Write your content using standard Markdown formatting...
```

### Step 3: Write Your Content

Use standard Markdown syntax:

```markdown
## Headings

### Subheadings

**Bold text** and *italic text*

- Bullet points
- More points

1. Numbered lists
2. Also supported

[Links](https://example.com)

> Blockquotes for emphasis

`code snippets`
```

### Step 4: Build and Deploy

```bash
npm run build
```

Your new post will be automatically:
- Listed on `/blog`
- Available at `/blog/your-post-slug`
- Statically generated for fast loading
- SEO optimized

## Frontmatter Fields

| Field | Required | Description |
|-------|----------|-------------|
| `title` | ✅ Yes | Post title (used in browser tab, SEO) |
| `date` | ✅ Yes | Publication date (YYYY-MM-DD format) |
| `excerpt` | ✅ Yes | Short description (shows in listings, SEO) |
| `author` | ✅ Yes | Author name |
| `image` | ❌ No | Featured image URL (not yet implemented) |

## File Organization

```
/content/blog/
  ├── getting-started-with-anonymous-feedback.md
  ├── ai-powered-feedback-analysis.md
  └── your-new-post.md
```

## SEO Features

Each blog post automatically gets:
- ✅ Proper title tags
- ✅ Meta descriptions
- ✅ OpenGraph tags for social sharing
- ✅ Responsive design
- ✅ Fast loading (static generation)

## Tips for Good Blog Posts

1. **Use descriptive slugs:** `5-tips-for-feedback` not `post-1`
2. **Write compelling excerpts:** This shows in search results
3. **Keep dates current:** Use actual publication date
4. **Use proper Markdown:** Headers, lists, links improve readability
5. **Add internal links:** Link to `/create`, `/pricing`, etc.

## Example Post Template

```markdown
---
title: "Your Catchy Title Here"
date: "2025-01-18"
excerpt: "A brief, engaging description that makes people want to read more."
author: "VoiceClara Team"
---

# Main Heading

Start with a compelling intro paragraph that hooks the reader.

## Why This Matters

Explain the problem or opportunity...

## How to Solve It

Provide actionable steps:

1. First step
2. Second step
3. Third step

## Conclusion

Wrap up with a call to action:

[Start Your Free Feedback Request](/create)
```

## Deleting Posts

Simply delete the markdown file from `/content/blog/` and rebuild.

## Troubleshooting

**Post not showing up?**
- Check that filename ends with `.md`
- Verify frontmatter format (three dashes before and after)
- Run `npm run build` again

**Build errors?**
- Ensure all required frontmatter fields are present
- Check for invalid characters in slug (use only lowercase letters, numbers, hyphens)

## Advantages Over WordPress

- ✅ **Free:** No hosting or CMS costs
- ✅ **Fast:** Static generation = lightning speed
- ✅ **Secure:** No database = no SQL injection
- ✅ **Simple:** Just Markdown files
- ✅ **Version Control:** Git tracks all changes
- ✅ **No Maintenance:** No plugins to update

## Need Help?

Questions about the blog system? Contact the development team or check Next.js documentation for static generation.
