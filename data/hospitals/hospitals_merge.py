#!/usr/bin/env python3
import json

f = open("hospitals_src.json", "r", encoding = "UTF-8")
hospitals = json.load(f)
f.close()

coords = {}
for i in range(0, 4):
	f = open("%d.csv" % i, "r", encoding = "big5", errors="ignore")
	f.readline() # skip the first line
	for line in f:
		line = line.strip()
		if not line:
			continue
		# print(line)
		parts = line.split(',')
		if parts[0]:
			addr = parts[2]
			coords[addr] = (float(parts[0]), float(parts[1]))
	f.close()

for h in hospitals:
	addr = h["機構地址"]
	if addr in coords:
		print(addr)
		h["pos"] = coords[addr]

f = open("hospitals.json", "w")
json.dump(hospitals, f, ensure_ascii=False)
f.close()
