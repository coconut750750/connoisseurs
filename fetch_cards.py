import requests
import json

def fetch_setnames():
    url = "https://www.crhallberg.com/cah/data/order.json"
    response = json.loads(requests.get(url).text)
    official_sets = {k: v for k, v in response.items() if k != 'order' and v['name'][0] != '['}
    return official_sets

def fetch_set(name, shortname):
    url = "https://www.crhallberg.com/cah/output.php"
    data = {"decks[]": shortname, "type": "JSON"}

    response = json.loads(requests.post(url, data).text)
    cards = {}
    cards['blackCards'] = response['blackCards']
    cards['whiteCards'] = response['whiteCards']
    with open(f'./app/game/sets/{name}', 'w') as f:
        json.dump(cards, f)

    return len(response['blackCards']), len(response['whiteCards'])

def main():
    official_sets = fetch_setnames()
    sets = [(v['name'], shortname) for shortname, v in official_sets.items()]
    totalblack = 0
    totalwhite = 0
    for s in sets:
        b, w = fetch_set(*s)
        totalblack += b
        totalwhite += w
    print(totalblack, totalwhite)
    print(totalblack+totalwhite)

if __name__ == '__main__':
    main()
