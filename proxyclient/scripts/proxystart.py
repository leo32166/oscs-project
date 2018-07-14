import subprocess, json, sys, argparse, requests, platform, socket
import FirewallRule
from iptableSetup import IptablesHandler
from WindowsFirewallHandler import WindowsFirewallHandler

#argument parser
parser = argparse.ArgumentParser()
parser.add_argument("port", help="port that the proxy will work off", type=int)
parser.add_argument("-u", "--username")
parser.add_argument("-p", "--password")
parser.add_argument("-n", "--no-sync", help="Do not sync with updated rules",
 action="store_true")

args = parser.parse_args()
if !args.no_sync:
    if args.username is None:
        print("No username!")
        sys.exit(status=None)
    else if args.password is None:
        print("No password!")
        sys.exit(status=None)

#configure iptables
#initialze iptables
port = sys.argv[1] if sys.argv[1] else 8080
IptablesHandler.initialize(port)

#Get rules from file
#TODO: Get rules from cloud app
rules = None
if args.no_sync:
    with open('../data/testrules.json', 'r') as ruleJson:
        rules = json.loads(ruleJson.read())
else:
    r = requests.post('https://...', data = {
        'username': args.username,
        'password': args.password
    });
    if r.status_code == 200:
        #parse the json containing data
        rules = json.loads(r.text)

#configuring firewall according to rules
if sys.platform.startswith('linux'): #iptables for linux
    for r in rules["firewallRules"]
        if r["direction"] == "incoming":
            IptablesHandler.createRule(r, True)
        elif r["direction"] == "outgoing":
            IptablesHandler.createRule(r, False)
        else:
            print("Error: Unrecognized firewall rule direction")
else if sys.platform == 'win32': #windows firewall for windows
    WindowsFirewallHandler.clear()
    WindowsFirewallHandler.addRules(rules)



#start mitmdump for web filter
print("Proxy Server IP:")
print(socket.gethostbyname(socket.gethostname()))
subprocess.run(["mitmdump", "-p", str(port), "-s", "proxyscript.py"])
