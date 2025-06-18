{
"mcpServers": {
"supabase": {
"command": "cmd",
"args": [
"/c",
"npx",
"-y",
"@supabase/mcp-server-supabase@latest",
"--access-token",
"sbp_505f3bac4146ca0d749acc455a61f16ad39cc906"
]
},
"context7": {
"command": "npx",
"args": ["-y", "@upstash/context7-mcp"],
"env": {
"DEFAULT_MINIMUM_TOKENS": "6000"
}
},
"playwright": {
"command": "npx",
"args": ["-y", "mcp-server-playwright"]
},
"consoleSpy": {
"url": "http://localhost:8766/sse"
}
}
}
