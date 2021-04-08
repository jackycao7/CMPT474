import json
import urllib3

def verifyCaptcha(body):
    url = "https://www.google.com/recaptcha/api/siteverify"
    
    try:
        http = urllib3.PoolManager()
        r = http.request("POST", url, fields={"secret": "6LdVDokaAAAAAPT5yQpxE6-pcub-eVNwybfTDvLS", "response": body["token"]})
        response = json.loads(r.data.decode("utf-8"))
    except Exception as e:
        raise Exception('Error:', e)

    if response["score"] < 0.8 :
        return False
    else:
        return True