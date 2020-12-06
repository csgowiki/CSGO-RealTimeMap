git pull
cp -r ./sourcemod/* ../
cd ../scripting
./compile.sh RealTimeMap.sp
mv ./compiled/RealTimeMap.smx ../plugins
cd ../CSGO-RealTimeMap
python3 server