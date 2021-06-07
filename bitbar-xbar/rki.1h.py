#!/usr/bin/env PYTHONIOENCODING=UTF-8 /usr/local/bin/python3

from time import localtime, strftime
import requests
from bs4 import BeautifulSoup

url = "https://www.rki.de/DE/Content/InfAZ/N/Neuartiges_Coronavirus/Fallzahlen.html"
page = requests.get(url)
soup = BeautifulSoup(page.content, 'html.parser')
region = soup.find("td", text="Hessen").find_next_siblings()
# just replace "Hessen" with your federal state. E.g. "Saarland"

print("🦠", region[3].text)
print(f"---") # create sub-menu
print(f"An­zahl: {region[0].text}")
print(f"Dif­fe­renz zum Vor­tag: {region[1].text}")
print(f"Fälle in den letzten 7 Tagen: {region[2].text}")
print(f"7-Tage-Inzi­denz: {region[3].text}")
print(f"Todes­fälle: {region[4].text}")
print(f"---")
print("Last update:", strftime("%Y-%m-%d %H:%M:%S", localtime()))
print("Update now | refresh=true")
print(f"---")
print(f"Open RKI website | href={url}")
