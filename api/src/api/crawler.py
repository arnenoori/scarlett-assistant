from fastapi import APIRouter, Depends
from pydantic import BaseModel
from api.src.api import auth
import sqlalchemy
from api.src import database as db
import json
import random
from supabase import create_client, Client
import os

router = APIRouter(
    prefix="/crawler",
    tags=["crawler"],
    dependencies=[Depends(auth.get_api_key)],
)

@router.post("/update_simplified_tos")
def update_simplified_tos(url: str):
    # shorten url to include only website name. Example: Google
    url = url.split("//")[-1].split("/")[0].lower()

    url = os.getenv('SUPABASE_URL')
    key = os.getenv('SUPABASE_KEY')
    supabase: Client = create_client(url, key)

    # query the database to get the file path of the terms of service in tos-bucket
    file_path = ""

    # get contents of the file from tos-bucket
    try:
        simplified_tos = supabase.storage.from_('tos-contents').download(file_path).decode('utf-8')
    except Exception as e:
        print(f"Error: {e}")
        return "Error"

    # Feed contents to GPT and get simplified output

    # store simplified output in bucket

    # store path to bucket in database
            
    return {"message": "Simplified terms of service updated successfully."}


@router.post("/crawl_site")
def crawl_site(url: str):
    # Crawl site and update database
    return "OK"
