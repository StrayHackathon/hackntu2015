#!/usr/bin/env python3
import googlemaps
import json

#gmaps = googlemaps.Client(key="AIzaSyBm3Vv7k-8DiE_uBvptymYypVtYlGnqF8g")
f = open("hospitals_src.json", "r", encoding = "UTF-8")
hospitals = json.load(f)
f.close()

results = []
result = bytes()
size = 0
for h in hospitals:
	#result = gmaps.geocode(h["機構地址"])
	#print(result)
	print(h["機構地址"])
	s = h["機構地址"].encode("big5", errors="ignore")
	if size + len(s) < 10000:
		result += s
		result += '\n'.encode("big5")
		size += len(s) + 1
	else:
		results.append(result)
		result = bytes()
		size = 0

if result:
	results.append(result)

i = 0
for result in results:
	f = open("hospitals_%d.csv" % i, "wb")
	f.write(result)
	f.close()
	i += 1
