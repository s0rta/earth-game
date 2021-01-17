import csv
import json

nodeJSON = []

with open('csvs/new/G7-nodes.csv') as csvfile:
    spamreader = csv.reader(csvfile, delimiter=',')
    i = 0
    
    for row in spamreader:
        if row[1] != "SpeciesID":
            biomass = 0
            trophicLevel = 0
            try:
                biomass = float(row[2])
            except:
                biomass = -1
            
            try:
                trophicLevel = float(row[7])
            except:
                trophicLevel = -1

            nodeJSON.append({"index": i, "speciesID": int(row[1]), "biomass": biomass, "organismType": row[3], "nodeColor": row[4], "nodeShape": row[5], "nodeName": row[6], "trophicLevel": trophicLevel, "desc": row[8], "imgFile": row[9], "imgCaption": row[10], "imgSource": row[11], "imgLiscence": row[12]})
            i+=1

print(json.dumps(nodeJSON))