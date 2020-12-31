import csv
import json

nodeJSON = []

with open('csvs/G7-nodes.xls') as csvfile:
    spamreader = csv.reader(csvfile, delimiter=',')
    i = 0
    
    for row in spamreader:
        if row[0] != "SpeciesID":
            biomass = 0
            try:
                biomass = float(row[3])
            except:
                biomass = -1
            nodeJSON.append({"index": i, "speciesID": int(row[0]), "groupName": row[2] if (row[1] == "") else row[1], "biomass": biomass})
            i+=1

print(json.dumps(nodeJSON))