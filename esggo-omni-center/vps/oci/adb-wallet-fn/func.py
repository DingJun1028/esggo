import json
import os

import oracledb
from fdk import response


def connect():
    wallet_dir = os.environ.get("WALLET_DIR", "/function/wallet")
    wallet_password = os.environ.get("WALLET_PASSWORD", "")
    oracledb.init_oracle_client(
        config_dir=wallet_dir,
        wallet_location=wallet_dir,
        wallet_password=wallet_password,
    )
    return oracledb.connect(
        user=os.environ["DB_USER"],
        password=os.environ["DB_PASSWORD"],
        dsn=os.environ.get("TNS_NAME", "dbname_high"),
    )


def handler(ctx, data: bytes = None):
    try:
        payload = json.loads(data.decode()) if data else {}
        sql = payload.get("sql", "SELECT 'ok' FROM dual")
        with connect() as conn, conn.cursor() as cur:
            cur.execute(sql)
            rows = [list(r) for r in cur.fetchall()]
        return response.Response(
            ctx,
            response_data=json.dumps({"rows": rows}),
            headers={"Content-Type": "application/json"},
        )
    except Exception as e:
        return response.Response(
            ctx,
            response_data=json.dumps({"error": str(e)}),
            status_code=500,
            headers={"Content-Type": "application/json"},
        )
