import glob
import re

def fix_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original = content
    
    # 1. Replace the gradient in the CTA container with var(--primary)
    # The gradient is: background: linear-gradient(135deg, var(--primary), var(--secondary))
    content = re.sub(
        r'background:\s*linear-gradient\([^)]+\)',
        'background: var(--primary)',
        content
    )

    # 2. Replace var(--accent) and var(--secondary) with var(--primary) for icons and tags.
    # What constitutes an icon or tag? 
    # - <i ... style="color: var(--accent)...">
    # - <div class="...icon..." style="background: ...; color: var(--secondary)...">
    # - <span class="tag" style="background: var(--accent)...">
    # - <div style="... background: var(--accent)..."> (like the "PROVEN" tag or "NATIONAL SILVER" tag)

    # Let's replace inline colors/backgrounds that use --accent or --secondary with --primary
    # However, we must be careful not to replace text colors that are intentionally secondary, 
    # except the user said "Use brand colours only throughout the site for icon and tag also."
    # So we'll replace specifically for tags and icons.
    
    # Let's use a function to process each tag
    def replacer(match):
        tag_content = match.group(0)
        # If the tag is an <i> (icon) or has class containing 'icon' or 'tag' or looks like a tag (uppercase, padding, absolute positioned badge)
        if re.search(r'<i\b', tag_content) or 'icon' in tag_content.lower() or 'tag' in tag_content.lower() or 'radius' in tag_content.lower():
            # Replace --accent and --secondary with --primary
            tag_content = re.sub(r'var\(--accent\)', 'var(--primary)', tag_content)
            tag_content = re.sub(r'var\(--secondary\)', 'var(--primary)', tag_content)
        return tag_content

    # Match any HTML tag with a style attribute containing var(--accent) or var(--secondary)
    content = re.sub(
        r'<[^>]+style="[^"]*var\(--(?:accent|secondary)\)[^"]*"[^>]*>',
        replacer,
        content
    )

    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {filepath}")

for file in glob.glob('*.html'):
    fix_file(file)
