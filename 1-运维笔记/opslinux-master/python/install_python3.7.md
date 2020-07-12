## 一、安装依赖
```bash
#安装相关编译工具
yum install -y readline readline-devel gcc gcc-c++ zlib zlib-devel openssl openssl-devel sqlite-devel python-devel

#python3.7版本需要
yum install libffi-devel -y
```

## 二、下载并安装python3.7
```bash
#源码安装
cd /usr/local/src/
wget -N https://www.python.org/ftp/python/3.7.4/Python-3.7.4.tgz
tar -xzf Python-3.7.4.tgz 
cd Python-3.7.4
./configure --prefix=/usr/local/python3.7 --enable-shared
make && make install

ln -s /usr/local/python3.7/bin/python3.7 /usr/bin/python3
ln -s /usr/local/python3.7/bin/pip3 /usr/bin/pip3
ln -s /usr/local/python3.7/bin/pyvenv /usr/bin/pyvenv

# 链接库文件
cp /usr/local/python3.7/lib/libpython3.7m.so.1.0 /usr/local/lib
cd /usr/local/lib
ln -s libpython3.7m.so.1.0 libpython3.7m.so
echo '/usr/local/lib' >> /etc/ld.so.conf
/sbin/ldconfig
```

## 三、pip升级
```bash
wget --no-check-certificate https://bootstrap.pypa.io/get-pip.py
python3 get-pip.py

pip3 install --upgrade pip -i https://pypi.mirrors.ustc.edu.cn/simple/
pip3 install -i https://pypi.mirrors.ustc.edu.cn/simple/  -r requirements.txt    #可用的
```

## 四、创建虚拟环境
```bash
cd /usr/local/
/usr/local/python3.7/bin/pyvenv demovenv
cd demovenv
source bin/activate

#推荐使用
cd /usr/local/
python3 -m venv demovenv
cd demovenv
source bin/activate
```
