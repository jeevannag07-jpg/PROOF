from sqlalchemy import create_engine
from backend.app.core.config import settings
from backend.app.core.database import DATABASE_URL

engine = create_engine(DATABASE_URL)
try:
    with engine.connect() as conn:
        result = conn.execute("SELECT 1").scalar()
        print(f"Success! Result: {result}")
except Exception as e:
    print(f"Error: {e}")
