# PulseOps Backend

FastAPI backend for the PulseOps hospital operations dashboard. Local persistence uses PostgreSQL, SQLAlchemy, and Alembic.

## Local setup

1. Create a PostgreSQL database and application role, then copy `.env.example` to `.env` and set a unique `JWT_SECRET_KEY` and `DATABASE_URL`.
2. Install the pinned dependencies in a virtual environment:

   ```bash
   python3 -m venv .venv
   .venv/bin/python -m pip install -r requirements.txt
   ```

3. Apply the schema and load the demo dataset:

   ```bash
   .venv/bin/alembic upgrade head
   .venv/bin/python seed_departments.py
   .venv/bin/python seed_all.py
   ```

4. Start the local API:

   ```bash
   .venv/bin/uvicorn app.main:app --reload
   ```

Set `GEMINI_API_KEY` only if you want the Gemini-backed Copilot. On macOS installations where `psycopg2` is built against PostgreSQL's bundled `libpq`, the server process may also need that PostgreSQL `lib` directory in `DYLD_LIBRARY_PATH`.

## Demo fixtures

`seed_data.py` contains fictional Indian hospital records with dates relative to the seed date, Asia/Kolkata alert timestamps, and invoice amounts in INR. `seed_departments.py` seeds departments only when the table is empty; `--refresh-demo` updates D1–D8 to the fixture names and heads. `seed_all.py` fills empty operational tables and skips populated tables. It does not create or modify user accounts.

All patient, staff, appointment, alert, inventory, and billing records in these fixtures are synthetic demo data. They are not for patient care or use as production records. Provision real user accounts and real operational data separately.
