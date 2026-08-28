# Crypto Market Data Collection — Session Notes

## Context

Task: "Phase 2 Agent 9: Collect cryptocurrency market data"
Source: CoinGecko API (`/coins/markets` endpoint)

## API Endpoint

```
GET https://api.coingecko.com/api/v3/coins/markets
  ?vs_currency=usd
  &ids=bitcoin,ethereum
  &order=market_cap_desc
  &per_page=2
  &page=1
  &sparkline=false
  &price_change_percentage=24h
```

No API key required. Returns JSON array with market data for BTC and ETH.

## Fields Collected

| Field | Source JSON key |
|---|---|
| `current_price_usd` | `current_price` |
| `price_change_24h_usd` | `price_change_24h` (rounded to 2 decimals) |
| `price_change_percentage_24h` | `price_change_percentage_24h` |
| `market_cap_usd` | `market_cap` |
| `market_cap_change_24h_usd` | `market_cap_change_24h` (rounded) |
| `market_cap_change_percentage_24h` | `market_cap_change_percentage_24h` |
| `volume_24h_usd` | `total_volume` |
| `market_cap_rank` | `market_cap_rank` |
| `high_24h_usd` | `high_24h` |
| `low_24h_usd` | `low_24h` |
| `last_updated` | `last_updated` |

## Hash Strategy

The `collected_at` timestamp is stored in the data dict but excluded from the hash:
```python
hash_content = {k: v for k, v in crypto_data.items() if k != "collected_at"}
```

This ensures the hash is stable across runs when market data hasn't changed, even though the collection timestamp differs.

## Windows Path Gotcha

When running via Windows Python (not MSYS bash), use `C:/tmp/...` not `/c/tmp/...` in Python file paths. Windows Python treats `/c/` as a relative path component.

## Sample Data (2026-07-23)

Bitcoin: $65,734, -0.5% (24h), $1.318T market cap
Ethereum: $1,928.00, +0.2% (24h), $232.7B market cap
