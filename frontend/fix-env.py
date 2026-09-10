import os, re, glob

files = glob.glob('src/**/*.jsx', recursive=True)

for f in files:
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
        
    new_content = content.replace('import.meta.process.env.VITE_API_URL', 'import.meta.env.VITE_API_URL')
    
    if new_content != content:
        with open(f, 'w', encoding='utf-8') as file:
            file.write(new_content)
