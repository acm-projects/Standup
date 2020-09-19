import os
import firebase_admin
from firebase_admin import credentials
from firebase_admin import auth
from firebase_admin import firestore

cred = credentials.Certificate(os.environ["GOOGLE_APPLICATION_CREDENTIALS"])
default_app = firebase_admin.initialize_app(cred)

db = firestore.client(app=default_app)

"""
users_ref = db.collection("users")

# Read data from "users" collection in Cloud Firestore database
for doc in users_ref.get():
    print(f"{doc.id}: {doc.to_dict()}")
"""

def add_user(**kwargs):
    user = auth.create_user(**kwargs)
    return user

def remove_user(user_uid):
    auth.delete_user(user_uid)
    return

### Debug/Testing ###

print(auth.get_oidc_provider_config("oidc.google"))
print("Success")