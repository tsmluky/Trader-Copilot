import os
import zipfile
import hashlib
from datetime import datetime

REQUIRED_EXCLUDES = {
    "node_modules",
    "venv",
    ".venv",
    "__pycache__",
    ".git",
    ".idea",
    ".vscode",
    "logs",
    "coverage",
    "dist",
    "build",
    ".DS_Store",
    "start_backend.bat",
    ".pytest_cache",
    ".mypy_cache",
    ".env",
    ".env.local",
    "vapid_keys.txt",
}

SENSITIVE_FILES = [
    "tools/vapid_keys.txt",
    ".env",
]


def generate_checksums(zip_name):
    print(f"Generating SHA256 checksum for {zip_name}...")
    sha256_hash = hashlib.sha256()
    with open(zip_name, "rb") as f:
        # Read and update hash string value in blocks of 4K
        for byte_block in iter(lambda: f.read(4096), b""):
            sha256_hash.update(byte_block)

    checksum = sha256_hash.hexdigest()

    audit_dir = os.path.join("tools", "audit")
    os.makedirs(audit_dir, exist_ok=True)

    sum_file = os.path.join(audit_dir, "sha256sums.txt")
    with open(sum_file, "w") as f:
        f.write(f"{checksum} *{zip_name}\n")
    print(f"✅ Checksum saved to {sum_file}")


def generate_manifest(zip_name):
    audit_dir = os.path.join("tools", "audit")
    os.makedirs(audit_dir, exist_ok=True)
    manifest_file = os.path.join(audit_dir, "package_manifest.txt")

    print(f"Generating manifest to {manifest_file}...")

    with zipfile.ZipFile(zip_name, "r") as zipf:
        file_list = zipf.namelist()
        with open(manifest_file, "w") as f:
            for name in sorted(file_list):
                f.write(f"{name}\n")

    print("✅ Manifest saved.")


def zip_project(output_filename):
    print(f"📦 Zipping project to {output_filename}...")

    # Validation of sensitive files
    for sens in SENSITIVE_FILES:
        if os.path.exists(sens):
            print(
                f"⚠️  WARNING: Sensitive file found locally: {sens} (Will be EXCLUDED from zip)"
            )

    with zipfile.ZipFile(output_filename, "w", zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk("."):
            # Filtering dirs in-place
            dirs[:] = [
                d for d in dirs if d not in REQUIRED_EXCLUDES and not d.startswith(".")
            ]

            for file in files:
                if (
                    file in REQUIRED_EXCLUDES
                    or file.endswith(".zip")
                    or file.endswith(".log")
                    or file.endswith(".pyc")
                    or file.endswith(".db")
                ):
                    continue

                # Double check for sensitive extensions
                if file.startswith(".env"):
                    continue

                # Relative path for zip
                file_path = os.path.join(root, file)
                arcname = os.path.relpath(file_path, ".")

                # Exclude self logic if needed, but we include tools/package_project.py usually

                zipf.write(file_path, arcname)

    print("✅ Zip created successfully.")

    generate_checksums(output_filename)
    generate_manifest(output_filename)


if __name__ == "__main__":
    ts = datetime.now().strftime("%Y%m%d")
    out_name = f"TraderCopilot_SaleReady_{ts}.zip"
    zip_project(out_name)
