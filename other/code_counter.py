import os

# Directory to search through
search_dir = "C:/Users/addis/OneDrive/COLLEGE/other/codeprojects/javascript/receipt splitter"
# Directories to exclude from the count
exclude_dirs = {"node_modules", ".git", ".github", "other"}

# Files to exclude
exclude_files = {"package-lock.json", "package.json"}

total_lines = 0
file_details = []

for root, dirs, files in os.walk(search_dir):
    # Exclude specific directories by modifying the 'dirs' list in place
    dirs[:] = [d for d in dirs if d not in exclude_dirs]
    for file in files:
        if file in exclude_files:
            continue  # Skip excluded files
        file_path = os.path.join(root, file)
        try:
            with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                lines = len(f.readlines())
                file_details.append((file, lines))  # Store file name and line count
                total_lines += lines
        except Exception as e:
            print(f"Error reading {file_path}: {e}")

# Sort files by line count in ascending order and print
for file, lines in sorted(file_details, key=lambda x: x[1]):
    print(f"{file}: {lines} lines")

print(f"Total lines of code: {total_lines}")
