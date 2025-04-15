#!/bin/bash

# sleep infinity

python3 manage.py makemigrations
python3 manage.py migrate

python manage.py shell <<EOF
from authentication.models import Role

roles = ["Customer", "Partner Owner", "Partner Store Manager", "Partner cashier"]
for role in roles:
    Role.objects.get_or_create(name=role)
EOF

python3 manage.py runserver 0.0.0.0:9000