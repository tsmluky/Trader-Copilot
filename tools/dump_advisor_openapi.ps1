$ErrorActionPreference = "Stop"

$spec = Invoke-RestMethod "http://127.0.0.1:8000/openapi.json"

# Endpoint target
$path = "/analyze/advisor/chat"
$ref = $spec.paths.$path.post.requestBody.content.'application/json'.schema.'$ref'
$schemaName = ($ref -split "/")[-1]

"Endpoint: $path"
"SchemaRef: $ref"
"SchemaName: $schemaName"
"---"

# Dump principal schema
$spec.components.schemas.$schemaName |
  ConvertTo-Json -Depth 100 |
  Set-Content -Encoding UTF8 ".\tools\$schemaName.schema.json"

# Dump relacionados (muy útiles para entender el contrato completo)
$related = @("ChatRequest","ChatMessage","ChatContext","AdvisorReq")
foreach ($name in $related) {
  if ($spec.components.schemas.PSObject.Properties.Name -contains $name) {
    $spec.components.schemas.$name |
      ConvertTo-Json -Depth 100 |
      Set-Content -Encoding UTF8 ".\tools\$name.schema.json"
  }
}

"OK: schemas volcados en .\tools\*.schema.json"
