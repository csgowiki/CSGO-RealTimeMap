#include <sourcemod>
#include <system2>
#include <json>

#define CHARSPLIT "|"
#define NAMESPLIT "!@!"

public Plugin:myinfo = {
    name = "Realtime map info sender",
    author = "CarOL",
    description = "WIP",
    url = "csgowiki.top"
};

public OnPluginStart() {
    HookEvent("hegrenade_detonate", Event_HegrenadeDetonate);
    HookEvent("flashbang_detonate", Event_FlashbangDetonate);
    HookEvent("smokegrenade_detonate", Event_SmokeDetonate);
    HookEvent("inferno_startburn", Event_MolotovDetonate);
    HookEvent("decoy_started", Event_DecoyDetonate);
    
    HookEvent("player_say", Event_PlayerSay);
    CreateTimer(0.1, InfoSender, _, TIMER_REPEAT);
    CreateTimer(1.0, MsgGeter, _, TIMER_REPEAT);
}

public OnMapStart() {
    MapInfoSender();
}

public OnClientConnected(client) {
    MapInfoSender();
}

public Action:Event_HegrenadeDetonate(Handle:event, const String:name[], bool:dontBroadcast) {
    int utid = GetEventInt(event, "entityid");
    float realX = GetEventFloat(event, "x");
    float realY = GetEventFloat(event, "y");
    char uttype[16] = "hegrenade";
    UtilitySender(utid, realX, realY, uttype);
}

public Action:Event_FlashbangDetonate(Handle:event, const String:name[], bool:dontBroadcast) {
    int utid = GetEventInt(event, "entityid");
    float realX = GetEventFloat(event, "x");
    float realY = GetEventFloat(event, "y");
    char uttype[16] = "flashbang";
    UtilitySender(utid, realX, realY, uttype);
}

public Action:Event_SmokeDetonate(Handle:event, const String:name[], bool:dontBroadcast) {
    int utid = GetEventInt(event, "entityid");
    float realX = GetEventFloat(event, "x");
    float realY = GetEventFloat(event, "y");
    char uttype[16] = "smokegrenade";
    UtilitySender(utid, realX, realY, uttype);
}

public Action:Event_MolotovDetonate(Handle:event, const String:name[], bool:dontBroadcast) {
    int utid = GetEventInt(event, "entityid");
    float realX = GetEventFloat(event, "x");
    float realY = GetEventFloat(event, "y");
    char uttype[16] = "molotov";
    UtilitySender(utid, realX, realY, uttype);
}

public Action:Event_DecoyDetonate(Handle:event, const String:name[], bool:dontBroadcast) {
    int utid = GetEventInt(event, "entityid");
    float realX = GetEventFloat(event, "x");
    float realY = GetEventFloat(event, "y");
    char uttype[16] = "decoy";
    UtilitySender(utid, realX, realY, uttype);
}

public Action:Event_PlayerSay(Handle:event, const String:name[], bool:dontBroadcast) {
    char name_[32];
    char message[48];
    int client = GetClientOfUserId(GetEventInt(event, "userid"));
    GetEventString(event, "text", message, sizeof(message));
    GetClientName(client, name_, sizeof(name_));
    msgSender(true, name_, message);
}

void msgSender(bool flag, char name[32], char message[48]) {
    System2HTTPRequest httpRequest = new System2HTTPRequest(
        msgSenderCallBack,
        "http://127.0.0.1:5000/server-api/msg"
    );
    if (flag)
        httpRequest.SetData("name=%s&msg=%s", name, message);
    else
        httpRequest.SetData("");
    httpRequest.POST();
}

void UtilitySender(int utid, float realX, float realY, char uttype[16]) {
    System2HTTPRequest httpRequest = new System2HTTPRequest(
        utSenderCallBack,
        "http://127.0.0.1:5000/server-api/utility"
    );
    httpRequest.SetData("utid=%d&realX=%f&realY=%f&uttype=%s", utid, realX, realY, uttype);
    httpRequest.POST();
}

void MapInfoSender() {
    char MapName[16];
    GetCurrentMap(MapName, sizeof(MapName));
    System2HTTPRequest httpRequest = new System2HTTPRequest(
        mapSenderCallBack,
        "http://127.0.0.1:5000/server-api/map"
    );
    httpRequest.SetData("mapname=%s", MapName);
    httpRequest.POST();
}

public Action:MsgGeter(Handle timer) {
    msgSender(false, "", "");
}

public Action:InfoSender(Handle timer) {
    char playerXs[96];
    char playerYs[96];
    char steam3ids[150];
    char names[150];
    char ids[20];
    int playerCount = 0;
    for (int client = 0; client <= MAXPLAYERS; client ++) {
        if (IsPlayer(client)) {
            char playerX[8];
            char playerY[8];
            float OriginPosition[3];
            char steam3id[16];
            char name[32];
            char id[2];
            GetClientAbsOrigin(client, OriginPosition);
            GetClientAuthId(client, AuthId_Steam3, steam3id, sizeof(steam3id));
            GetClientName(client, name, sizeof(name));
            FloatToString(OriginPosition[0], playerX, sizeof(playerX));
            FloatToString(OriginPosition[1], playerY, sizeof(playerY));
            IntToString(client, id, sizeof(id));
            if (playerCount != 0) {
                StrCat(playerXs, sizeof(playerXs), CHARSPLIT);
                StrCat(playerYs, sizeof(playerYs), CHARSPLIT);
                StrCat(steam3ids, sizeof(steam3ids), CHARSPLIT);
                StrCat(names, sizeof(names), NAMESPLIT);
                StrCat(ids, sizeof(ids), CHARSPLIT);
            }
            StrCat(playerXs, sizeof(playerXs), playerX);
            StrCat(playerYs, sizeof(playerYs), playerY);
            StrCat(steam3ids, sizeof(steam3ids), steam3id);
            StrCat(names, sizeof(names), name);
            StrCat(ids, sizeof(ids), id);
            playerCount++;
        }
    }
    System2HTTPRequest httpRequest = new System2HTTPRequest(
        senderCallBack,
        "http://127.0.0.1:5000/server-api/player"
    );
    httpRequest.SetData("playerXs=%s&playerYs=%s&steam3ids=%s&names=%s&ids=%s", 
        playerXs, playerYs, steam3ids, names, ids);
    httpRequest.POST();
}

public utSenderCallBack(bool success, const char[] error, System2HTTPRequest request, System2HTTPResponse response, HTTPRequestMethod method) {
}

public senderCallBack(bool success, const char[] error, System2HTTPRequest request, System2HTTPResponse response, HTTPRequestMethod method) {
}

public mapSenderCallBack(bool success, const char[] error, System2HTTPRequest request, System2HTTPResponse response, HTTPRequestMethod method) {
}

public msgSenderCallBack(bool success, const char[] error, System2HTTPRequest request, System2HTTPResponse response, HTTPRequestMethod method) {
    if (success) {
        char[] content = new char[response.ContentLength + 1];
        char status[8];
        char ip[18], msg[48];
        response.GetContent(content, response.ContentLength + 1);
        JSON_Object json_obj = json_decode(content);
        json_obj.GetString("status", status, sizeof(status));
        if (StrEqual(status, "Good")) {
            json_obj.GetString("ip", ip, sizeof(ip));
            json_obj.GetString("msg", msg, sizeof(msg));
            PrintToChatAll("<ip:\x03%s\x01> %s", ip, msg);
        }
    }
}

stock bool IsPlayer(int client) {
    return IsValidClient(client) && !IsFakeClient(client) && !IsClientSourceTV(client);
}

stock bool IsValidClient(int client) {
    return client > 0 && client <= MaxClients && IsClientConnected(client) && IsClientInGame(client);
}