from utils import MessageQueue

m = MessageQueue()

m.qPut("qMap", [1])
m.qPut("qPlayerMove", [1])

print(m.qGets_noWait(["qMap", "q2WebMsg", "qPlayerMove"]))
