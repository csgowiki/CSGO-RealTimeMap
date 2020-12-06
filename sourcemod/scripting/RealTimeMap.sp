#include <sourcemod>
#include <system2>

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
    
    HookEvent("player_say", Event_PlayerSay);
    CreateTimer(0.1, InfoSender, _, TIMER_REPEAT);
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

public Action:Event_PlayerSay(Handle:event, const String:name[], bool:dontBroadcast) {
    char name[32];
    char message[48];
    int client = GetClientOfUserId(GetEventInt(event, "userid"));
    GetEventString(event, "text", message, sizeof(message));
    GetClientName(client, name, sizeof(name));

}

void msgSender(char name[32], char message[48]) {
    System2HTTPRequest httpRequest = new System2HTTPRequest(
        msgSenderCallBack,
        "http://127.0.0.1:5000/server-api/msg"
    );
    httpRequest.SetData("name=%s&msg=%s", name, message);
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

public Action:InfoSender(Handle timer) {
    char playerXs[96];
    char playerYs[96];
    char steam3ids[150];
    char names[150];
    int playerCount = 0;
    for (int client = 0; client <= MAXPLAYERS; client ++) {
        if (IsPlayer(client)) {
            char playerX[8];
            char playerY[8];
            float OriginPosition[3];
            char steam3id[16];
            char name[32];
            GetClientAbsOrigin(client, OriginPosition);
            GetClientAuthId(client, AuthId_Steam3, steam3id, sizeof(steam3id));
            GetClientName(client, name, sizeof(name));
            FloatToString(OriginPosition[0], playerX, sizeof(playerX));
            FloatToString(OriginPosition[1], playerY, sizeof(playerY));
            if (playerCount != 0) {
                StrCat(playerXs, sizeof(playerXs), CHARSPLIT);
                StrCat(playerYs, sizeof(playerYs), CHARSPLIT);
                StrCat(steam3ids, sizeof(steam3ids), CHARSPLIT);
                StrCat(names, sizeof(names), NAMESPLIT);
            }
            StrCat(playerXs, sizeof(playerXs), playerX);
            StrCat(playerYs, sizeof(playerYs), playerY);
            StrCat(steam3ids, sizeof(steam3ids), steam3id);
            StrCat(names, sizeof(names), name);
            playerCount++;
        }
    }
    System2HTTPRequest httpRequest = new System2HTTPRequest(
        senderCallBack,
        "http://127.0.0.1:5000/server-api/player"
    );
    httpRequest.SetData("playerXs=%s&playerYs=%s&steam3ids=%s&names=%s", 
        playerXs, playerYs, steam3ids, names);
    httpRequest.POST();
}

public utSenderCallBack(bool success, const char[] error, System2HTTPRequest request, System2HTTPResponse response, HTTPRequestMethod method) {
}

public senderCallBack(bool success, const char[] error, System2HTTPRequest request, System2HTTPResponse response, HTTPRequestMethod method) {
}

public mapSenderCallBack(bool success, const char[] error, System2HTTPRequest request, System2HTTPResponse response, HTTPRequestMethod method) {
}

public msgSenderCallBack(bool success, const char[] error, System2HTTPRequest request, System2HTTPResponse response, HTTPRequestMethod method) {
}

stock bool IsPlayer(int client) {
    return IsValidClient(client) && !IsFakeClient(client) && !IsClientSourceTV(client);
}

stock bool IsValidClient(int client) {
    return client > 0 && client <= MaxClients && IsClientConnected(client) && IsClientInGame(client);
}