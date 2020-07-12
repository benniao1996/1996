export WSL_HOST=$(tail -1 /etc/resolv.conf | cut -d' ' -f2)
export DISPLAY=$WSL_HOST:0

# 删除旧的 hosts
sudo sed -i '/#windows_ip/d' /etc/hosts
sudo sed -i "1i${WSL_HOST}   h.test   #windows_ip" /etc/hosts

# 启动 systemd
source /usr/sbin/start-systemd-namespace
