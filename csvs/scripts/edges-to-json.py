import csv
import json


# needs to be the node list in relation to the edge list
nodeJSON = [{"index": 0, "speciesID": 210, "groupName": "raccoon", "organismType": "0.9857072", "biomass": 0.9857072}, {"index": 1, "speciesID": 300, "groupName": "plant", "organismType": "47981.15827", "biomass": 47981.15827}, {"index": 2, "speciesID": 350, "groupName": "wave-attenuation", "organismType": "45684.9337", "biomass": 45684.9337}, {"index": 3, "speciesID": 400, "groupName": "micro-org", "organismType": "NA", "biomass": -1}, {"index": 4, "speciesID": 450, "groupName": "shoreline-stabilization", "organismType": "47509.3846", "biomass": 47509.3846}, {"index": 5, "speciesID": 500, "groupName": "mollusc", "organismType": "1788.9109237", "biomass": 1788.9109237}, {"index": 6, "speciesID": 550, "groupName": "carbon-storage", "organismType": "49779.82555", "biomass": 49779.82555}, {"index": 7, "speciesID": 600, "groupName": "insect", "organismType": "18.034916954", "biomass": 18.034916954}, {"index": 8, "speciesID": 650, "groupName": "water-filtration", "organismType": "47789.69028", "biomass": 47789.69028}, {"index": 9, "speciesID": 700, "groupName": "plankton", "organismType": "11.785835079", "biomass": 11.785835079}, {"index": 10, "speciesID": 750, "groupName": "commercial-fishery", "organismType": "0.9714345", "biomass": 0.9714345}, {"index": 11, "speciesID": 800, "groupName": "crustacea", "organismType": "191.3924808", "biomass": 191.3924808}, {"index": 12, "speciesID": 850, "groupName": "birdwatching", "organismType": "0.369631471", "biomass": 0.369631471}, {"index": 13, "speciesID": 900, "groupName": "fish", "organismType": "19.1147404", "biomass": 19.1147404}, {"index": 14, "speciesID": 950, "groupName": "waterfowl-hunting", "organismType": "0.8204547", "biomass": 0.8204547}, {"index": 15, "speciesID": 1000, "groupName": "bird", "organismType": "3.173470346", "biomass": 3.173470346}, {"index": 16, "speciesID": 1050, "groupName": "recreational-fishery", "organismType": "584.6903931", "biomass": 584.6903931}]

edgeJSON = []

def matchingID(x, rsID):
    if x["speciesID"] == int(rsID):
        return True
    return False

with open('G1-edges.xls') as csvfile:
    spamreader = csv.reader(csvfile, delimiter=',')
    i = 0
    
    for row in spamreader:
        if row[1] != "ResourceSpeciesID":
            rsID = row[1]
            cID = row[2]

            rsIndex = [x["index"] for x in nodeJSON if matchingID(x, rsID)][0]
            cIndex = [x["index"] for x in nodeJSON if matchingID(x, cID)][0]

            edgeJSON.append({"target": rsIndex, "source": cIndex, "Type": row[3]})
            i+=1

print(json.dumps(edgeJSON))