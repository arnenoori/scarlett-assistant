from fastapi import APIRouter, Depends
from pydantic import BaseModel
from src.api import auth
import sqlalchemy
from src import database as db
import json
import random

router = APIRouter(
    prefix="/tos",
    tags=["tos"],
    dependencies=[Depends(auth.get_api_key)],
)

@router.post("/get_tos")
def post_deliver_barrels(url: str):
    # shorten url to only include domain and path, Example: google.com
    url = url.split("/")[2]

    # query the database first to check if url is already cached, if so return 'simplified_content' from terms_of_service table
    with db.engine.connect() as connection:
        result = connection.execute(f"SELECT * FROM terms_of_service WHERE url = '{url}' RETURNING website_id")
        row = result.fetchone()
        if row:
            website_id = row[0]
            result = connection.execute(f"SELECT simplified FROM terms_of_service WHERE website_id = '{website_id}'")
            row = result.fetchone()
            if row:
                return {'message': row[0]}
            

    # else if url is not cached, use the url to scrape the website and store the 'simplified_content' in the database, then return 'simplified_content'
    

    return {"message": "Unable to retrieve terms of service for this website at this time. Please try again later."}


