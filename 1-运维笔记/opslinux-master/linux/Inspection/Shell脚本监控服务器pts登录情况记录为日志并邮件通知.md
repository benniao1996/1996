 # Shell脚本监控服务器pts登录情况记录为日志并邮件通知
 
## 一、配置服务器sendmail发邮件功能
 
 安装sendmail服务：
```sh
yum  install  sendmail  -y
yum -y install mailx
yum -y install jwhois
```

 下面启动sendmail服务：
```sh
/etc/init.d/sendmail  restart

systemctl restart sendmail
```

启动后请单独用mail -s测试邮件是否可以发送出去，此处不介绍了。
```
mail -s test 1151980610@qq.com
```

## 二、Linux下用nali查询IP地址归属地：
安装nali
```
wget https://github.com/dzxx36gyy/nali-ipip/archive/master.zip
unzip master.zip
cd nali-ipip-master/
./configure && make && make install && nali-update
```

如果要使用nali的全部命令，需要安装一下依赖包
```
CentOS/RedHat: yum install traceroute bind-utils bind-utils -y
Debian/Ubuntu: apt-get update; apt-get install traceroute dnsutils bind-utils -y
```

查看一下环境变量nali在哪个目录下：
```sh
which nali
```

使用nali命令瞧一瞧:
```sh
nali  42.96.189.63

42.96.189.63 [中国 山东 青岛]
```

    如果nali命令得到的中文地名输入到log中或发送出去的邮件中为空或乱码，那可能是服务器、脚本的编码问题，请自行解决。下面说正事儿：

## 三、编写脚本

```
# vim  /opt/scripts/ssh_login_monitor.sh

#!/bin/bash

echo
CommonlyIP=("192.168.56.2" "192.168.56.1")                           #  常用ssh登陆服务器的IP地址,即IP白名单
SendToEmail=("1151980610@qq.com" "123456789@qq.com")   #  接收报警的邮箱地址

LoginInfo=`last | grep "still logged in" | head -n1`
UserName=`echo $LoginInfo | gawk '{print $1}'`
LoginIP=`echo $LoginInfo | gawk '{print $3}'`
LoginTime=`date +'%Y-%m-%d %H:%M:%S'`
LoginPlace=`/usr/local/bin/nali $LoginIP | gawk -F'[][]' '{print $2}'`
SSHLoginLog="/var/log/login_access.log"

for ip in ${CommonlyIP[*]}  # 判断登录的客户端地址是否在白名单中
do
    if [ "$LoginIP" == $ip ];then
        COOL="YES"
    fi
done

if [ "$COOL" == "YES" ];then
    echo "用户【 $UserName 】于北京时间【 $LoginTime 】登陆了服务器,其IP地址安全！" >> $SSHLoginLog
elif [ $LoginIP ];then
    echo "用户【 $UserName 】于北京时间【 $LoginTime 】登陆了服务器,其IP地址为【 $LoginIP 】,归属地【 $LoginPlace 】" | mail -s "【 通知 】 有终端SSH连上服务器了!" ${SendToEmail[*]}
    echo "用户【 $UserName 】于北京时间【 $LoginTime 】登陆了服务器,其IP地址为【 $LoginIP 】,归属地【 $LoginPlace 】" >> $SSHLoginLog
fi
echo
```
  
## 四、配置生效
  将脚本添加到hosts.allow里，登录终端自动执行该脚本一次：
  ```
  # vim  /etc/hosts.allow
  
  # 添加下面这句话即可
  sshd:All:spawn (/bin/sh /mydata/bash_shell/ssh_login_monitor.sh) &:allow
  ```
  
 【BUG提示】本人在后期使用过程中发现，如果写在/etc/hosts.allow中，会有一个BUG，那就是第一个SSH终端登录的用户将不会被“监视”到，也就是无法触发脚本，不会记录下日志。于是做如下改进：

## 五、配置改进
   将脚本写到到 /etc/ssh/sshrc 中，ssh登录时自动执行该脚本一次：
```
# vim  /etc/ssh/sshrc

# 添加下面这句话即可
/bin/sh  /opt/scripts/ssh_login_monitor.sh
```

    由于/etc/hosts.allow 无论登录用户是谁，执行该文件中的都将是root用户，因此，被调用的脚本也是root执行的。但是 /etc/ssh/sshrc 中就不一样了，哪个用户登录的，就是哪个用户执行脚本，那么问题来了，记录登录信息的日志此时可能权限为644（echo生成的txt文件默认权限），普通用户写不成该文件！所以一定要记得用root用户赋予login_access.log文件 666 权限（如果结合zabbix自定义报警的话，就需要读文件，在这里读写权限一起给了）：
   
```
chmod  666  /var/log/login_access.log
```
    可以打开一个新的终端试试效果了。如果脚本没有执行，请赋予脚本可执行权限（chmod +x），讲道理/bin/sh已经避免了权限导致脚本不可执行的问题。下面是实际效果：

  查看邮箱：
  
  查看服务器上登录记录日志：
  ```
  vim  /var/log/login_access.log
  ```
  至此，监控终端登陆全部完成！


参考文档：

https://cloud.tencent.com/developer/article/1362614  利用Nali-ipip在线工具查看域名解析/IP位置/MTR追踪路由

https://my.oschina.net/jamieliu/blog/718863   Shell脚本监控服务器pts登录情况记录为日志并邮件通知
