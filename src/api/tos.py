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
    # first check if url is already cached, if so return

    # else call gpt api and then return

    return {"message": "tos"}