from fastapi import APIRouter, Depends
from pydantic import BaseModel
from src.api import auth
import sqlalchemy
from src import database as db
import json
import random

router = APIRouter(
    prefix="/crawler",
    tags=["crawler"],
    dependencies=[Depends(auth.get_api_key)],
)

@router.post("/crawl_site")
def crawl_site(url: str):
    # Crawl site and update database
    return "OK"
