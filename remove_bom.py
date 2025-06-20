import sys

def remove_bom_from_file(filename):
    with open(filename, 'rb') as f:
        content = f.read()
    # UTF-8 BOM is b'\xef\xbb\xbf'
    if content.startswith(b'\xef\xbb\xbf'):
        content = content[3:]
        with open(filename, 'wb') as f:
            f.write(content)
        print(f"BOM removed from {filename}")
    else:
        print(f"No BOM found in {filename}")

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python remove_bom.py <path_to_json_file>")
    else:
        remove_bom_from_file(sys.argv[1])
