import csv
import json

nodeJSON = []

with open('csvs/new/G1-nodes.csv') as csvfile:
    spamreader = csv.reader(csvfile, delimiter=',')
    i = 0
    
    for row in spamreader:
        if row[0] != "SpeciesID":
            biomass = 0
            trophicLevel = 0
            try:
                biomass = float(row[1])
            except:
                biomass = -1
            
            try:
                trophicLevel = float(row[6])
            except:
                trophicLevel = -1

            nodeJSON.append({"index": i, "id": row[0], "TG": 0, "B": biomass, "type" : 0, "organismType": row[2], "nodeColor": row[3], "nodeShape": row[4], "nodeName": row[5], "TL": trophicLevel, "desc": row[7], "imgFile": row[8], "imgCaption": row[9], "imgSource": row[10], "imgLiscence": row[11]})
            i+=1

print(json.dumps(nodeJSON))