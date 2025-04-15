# utils.py
from django.db.models import Max
import requests

def two_letter_code(name: str) -> str:
    name = name.strip().upper()
    return (name + "X")[:2]

def get_neighborhood_from_coords(lat: float, lon: float) -> str:
    url = "https://nominatim.openstreetmap.org/reverse"
    params = {"format": "json", "lat": lat, "lon": lon, "addressdetails": 1}
    headers = {"User-Agent": "MyApp/1.0 (me@example.com)"}
    resp = requests.get(url, params=params, headers=headers, timeout=5)
    resp.raise_for_status()
    addr = resp.json().get("address", {})
    return addr.get("neighbourhood") or addr.get("suburb") or ""

def next_sequence(prefix: str) -> str:
    from .models import Order
    agg = Order.objects.filter(code__startswith=prefix).aggregate(max_code=Max('code'))
    max_code = agg['max_code']
    if not max_code:
        n = 1
    else:
        n = int(max_code[-4:]) + 1
    return str(n).zfill(4)
