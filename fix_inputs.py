import os
import glob
import re

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # We want to add explicit text colors, background colors, and placeholder colors to inputs.
    # Find all className="..." inside <input and <select and make sure they have explicit colors.
    
    # Simple approach: Replace common input class patterns with an explicitly styled one.
    # The existing class: className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
    
    replacements = {
        'className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"': 
        'className="w-full px-3 py-2 text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"',
        
        # Search input
        'className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-black outline-none font-medium text-gray-700 dark:text-gray-300"':
        'className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-black dark:focus:ring-white outline-none font-medium text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"',
    }
    
    new_content = content
    for pattern, repl in replacements.items():
        new_content = new_content.replace(pattern, repl)
        
    # Let's also enforce `bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500` for ANY input that lacks them.
    # Since regex can be tricky, the above exact matches will fix Dashboard.
    
    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Fixed inputs in {filepath}")

if __name__ == "__main__":
    files = glob.glob('frontend/src/pages/*.jsx')
    for f in files:
        process_file(f)
