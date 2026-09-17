import os
import glob
import re

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Apply dark mode mappings
    replacements = {
        r'\bbg-white\b(?! dark:bg-)': 'bg-white dark:bg-gray-900',
        r'\bbg-gray-50\b(?! dark:bg-)': 'bg-gray-50 dark:bg-gray-950',
        r'\bbg-gray-100\b(?! dark:bg-)': 'bg-gray-100 dark:bg-gray-800',
        r'\bbg-gray-50/50\b(?! dark:bg-)': 'bg-gray-50/50 dark:bg-gray-800/50',
        
        r'\btext-gray-900\b(?! dark:text-)': 'text-gray-900 dark:text-gray-100',
        r'\btext-gray-800\b(?! dark:text-)': 'text-gray-800 dark:text-gray-200',
        r'\btext-gray-700\b(?! dark:text-)': 'text-gray-700 dark:text-gray-300',
        r'\btext-gray-600\b(?! dark:text-)': 'text-gray-600 dark:text-gray-400',
        r'\btext-gray-500\b(?! dark:text-)': 'text-gray-500 dark:text-gray-400',
        r'\btext-black\b(?! dark:text-)': 'text-black dark:text-white',
        
        r'\bborder-gray-200\b(?! dark:border-)': 'border-gray-200 dark:border-gray-700',
        r'\bborder-gray-100\b(?! dark:border-)': 'border-gray-100 dark:border-gray-800',
        
        r'\bhover:bg-gray-50\b(?! dark:hover:bg-)': 'hover:bg-gray-50 dark:hover:bg-gray-800',
        r'\bhover:bg-gray-100\b(?! dark:hover:bg-)': 'hover:bg-gray-100 dark:hover:bg-gray-800',
    }
    
    new_content = content
    for pattern, repl in replacements.items():
        new_content = re.sub(pattern, repl, new_content)
        
    # Inject useTranslation if not present
    if 'useTranslation' not in new_content and 'export default' in new_content:
        # Add import
        import_stmt = "import { useTranslation } from 'react-i18next';\n"
        # Find the last import
        lines = new_content.split('\n')
        last_import = 0
        for i, line in enumerate(lines):
            if line.startswith('import '):
                last_import = i
        lines.insert(last_import + 1, import_stmt)
        
        # We won't automatically inject `const { t } = useTranslation();` because finding the component start is tricky.
        new_content = '\n'.join(lines)

    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated {filepath}")

if __name__ == "__main__":
    files = glob.glob('frontend/src/pages/*.jsx')
    for f in files:
        process_file(f)
