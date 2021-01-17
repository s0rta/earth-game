import csv
import json

nodeJSON = []

with open('csvs/new/G7-nodes.csv') as csvfile:
    spamreader = csv.reader(csvfile, delimiter=',')
    i = 0
    
    for row in spamreader:
        if row[1] != "SpeciesID":
            biomass = 0
            try:
                biomass = float(row[3])
            except:
                biomass = -1
            nodeJSON.append({"index": i, "speciesID": int(row[1]), "biomass": biomass, "organismType": row[2], "nodeColor": row[3], "nodeShape": row[4], "nodeName": row[5], "trophicLevel": row[6], "desc": row[7], "imgFile": row[8], "imgCaption": row[9], "imgSource": row[10], "imgLiscence": row[11]})
            i+=1

print(json.dumps(nodeJSON))