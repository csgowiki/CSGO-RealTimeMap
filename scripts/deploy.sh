clear
echo "--- 确保该脚本放置在CSGO根目录下 ---"
echo "[1/10] 更新apt-get/升级包"
sudo apt-get update
sudo apt-get upgrade
echo "[2/10] 安装git/python3-pip"
sudo apt-get install git
sudo apt-get install python3-pip
echo "[3/10] 同步github库"
git clone https://github.com/hx-w/CSGO-RealTimeMap.git
echo "[4/10] 安装网站依赖"
pip3 install -r requirements.txt