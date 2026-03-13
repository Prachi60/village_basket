import os

def replace_in_file(file_path, search_text, replace_text):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if search_text in content:
        new_content = content.replace(search_text, replace_text)
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated: {file_path}")

admin_dir = r"c:\Users\HP\Desktop\Village-Basket\frontend\src\modules\admin"
search_str = "apnasabjiwala"
replace_str = "villagebasket"

for root, dirs, files in os.walk(admin_dir):
    for file in files:
        if file.endswith(('.tsx', '.ts')):
            replace_in_file(os.path.join(root, file), search_str, replace_str)
