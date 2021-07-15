#!/usr/bin/env PYTHONIOENCODING=UTF-8 /usr/local/bin/python3

from time import localtime, strftime
from datetime import datetime
import requests

pihole = "http://192.168.2.4/admin"
page = requests.get(pihole + "/api.php")
json = page.json()

print("🚫", json["ads_blocked_today"])
print(f"---") # create sub-menu
print("Domains being blocked:", json["domains_being_blocked"])
print("Ads blocked today:", json["ads_blocked_today"])
print("Ads blocked today:", f"{json['ads_percentage_today']}%")
date = datetime.utcfromtimestamp(json["gravity_last_updated"]["absolute"]).strftime('%Y-%m-%d %H:%M:%S')
print("Gravity last updated:", date)
print(f"---")
print(f"Open Dashboard | href={pihole}")
# print( "Refresh | shell=open | param1=/Applications/iTerm.app/")
# print( "Refresh | shell=open | param1='/Applications/iTerm.app/ < pi'")
print(f"---")
print("Last update:", strftime("%Y-%m-%d %H:%M:%S", localtime()))
