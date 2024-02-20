import uvicorn
from fastapi import FastAPI

app = FastAPI()

if __name__ == "__main__":
    config = uvicorn.Config(
        "api.src.api.server:app", port=3000, log_level="info", reload=True, env_file=".env"
    )
    server = uvicorn.Server(config)
    server.run()