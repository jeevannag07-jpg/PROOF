from sqlalchemy import create_engine, text
import os
from dotenv import load_dotenv

load_dotenv()
raw_url = os.getenv("DATABASE_URL")
url = raw_url.strip()
if url.startswith("postgres://"):
    url = url.replace("postgres://", "postgresql+pg8000://", 1)
elif url.startswith("postgresql://") and not url.startswith("postgresql+"):
    url = url.replace("postgresql://", "postgresql+pg8000://", 1)
if "?sslmode=require" in url:
    url = url.replace("?sslmode=require", "")
elif "&sslmode=require" in url:
    url = url.replace("&sslmode=require", "")

engine = create_engine(url)
with engine.connect() as conn:
    result = conn.execute(text("SELECT 1")).scalar()
    print("Test query result:", result)
