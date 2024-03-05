from fastapi import FastAPI, exceptions
from fastapi.responses import JSONResponse
from pydantic import ValidationError
from api.src.api import auth, crawler, server, tos
import json
import logging
import sys
from starlette.middleware.cors import CORSMiddleware

description = """
tos-buddy is a chrome extension that helps users understand and control their privacy on the internet. 
It tells users if a website's terms of service are good or bad and warns them about privacy risks. 
The extension also keeps track of what personal information users share with websites.
"""

app = FastAPI(
    title="TOS Buddy",
    description=description,
    version="0.0.1",
    terms_of_service="http://example.com/terms/",
    contact={
        "name": "Connor OBrien & Arne Noori",
        "email": "agnoori@calpoly.edu",
    },
)

# This origins list determines who can access the API
origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "OPTIONS"],
    allow_headers=["*"],
)

app.include_router(crawler.router)
app.include_router(tos.router)

@app.exception_handler(exceptions.RequestValidationError)
@app.exception_handler(ValidationError)
async def validation_exception_handler(request, exc):
    logging.error(f"The client sent invalid data!: {exc}")
    exc_json = json.loads(exc.json())
    response = {"message": [], "data": None}
    for error in exc_json:
        response['message'].append(f"{error['loc']}: {error['msg']}")

    return JSONResponse(response, status_code=422)

@app.get("/")
async def root():
    return {"message": "Welcome to TOS Buddy"}