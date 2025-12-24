
import sys
import os
import json
import shutil
from pathlib import Path

# Setup paths
current_dir = os.path.dirname(os.path.abspath(__file__))
backend_dir = os.path.join(os.path.dirname(os.path.dirname(current_dir)), 'backend')
sys.path.append(backend_dir)

# Mock env for imports
os.environ["DATABASE_URL"] = "sqlite:///:memory:"

try:
    from main import app
    from fastapi.openapi.utils import get_openapi
except ImportError as e:
    print(f"Error importing app: {e}")
    sys.exit(1)

def main():
    print("Exporting OpenAPI...")
    openapi_schema = app.openapi()
    
    # Ensure output dir exists
    output_dir = os.path.join(current_dir, 'schemas')
    os.makedirs(output_dir, exist_ok=True)
    
    # Save full openapi.json
    with open(os.path.join(current_dir, 'openapi.json'), 'w') as f:
        json.dump(openapi_schema, f, indent=2)
    print(f"Saved tools/audit/openapi.json")

    # Extract specific schemas
    target_schemas = ["AdvisorChatReq", "ChatMessage", "ChatContext", "ChatRequest"]
    components = openapi_schema.get("components", {}).get("schemas", {})
    
    for schema_name in target_schemas:
        if schema_name in components:
            schema_data = components[schema_name]
            with open(os.path.join(output_dir, f"{schema_name}.json"), 'w') as f:
                json.dump(schema_data, f, indent=2)
            print(f"Saved tools/audit/schemas/{schema_name}.json")
        else:
            print(f"Warning: Schema {schema_name} not found in OpenAPI components.")

    # Check for include_in_schema=False (manual Inspection needed usually, but we can check paths)
    # This is hard to check from the generated JSON as they are excluded :D
    # So we just report what IS there.
    
    # Check for duplicates in paths
    paths = openapi_schema.get("paths", {})
    advisor_paths = [p for p in paths if "advisor" in p.lower()]
    print("\nAdvisor Paths found:", advisor_paths)
    
    with open(os.path.join(current_dir, 'OPENAPI_NOTES.md'), 'w') as f:
        f.write("# OpenAPI Audit Notes\n\n")
        f.write("## Advisor Paths\n")
        for p in advisor_paths:
            f.write(f"- `{p}`\n")
        
        f.write("\n## Schemas Extracted\n")
        for s in target_schemas:
            found = s in components
            status = '[FOUND]' if found else '[NOT FOUND]'
            f.write(f"- {s}: {status}\n")

if __name__ == "__main__":
    main()
