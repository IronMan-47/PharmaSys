import os
import glob
import re

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find the main component function: e.g. `function Dashboard() {` or `const Dashboard = () => {`
    # We will just insert `const { t } = useTranslation();` right after it.
    
    # regex for `function SomeName() {`
    pattern1 = r'(function\s+[A-Z][a-zA-Z0-9_]*\s*\([^)]*\)\s*\{)'
    
    def replacer(match):
        return match.group(1) + '\n  const { t } = useTranslation();\n'

    if 'const { t } = useTranslation();' not in content:
        new_content = re.sub(pattern1, replacer, content, count=1)
        
        if new_content != content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Injected t() into {filepath}")

if __name__ == "__main__":
    files = glob.glob('frontend/src/pages/*.jsx')
    for f in files:
        process_file(f)
