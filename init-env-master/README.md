# init-env

> 初始化服务器，WSL 和开发环境的配置文件。

![License](https://img.shields.io/github/license/syfxlin/init-env.svg?style=flat-square) ![Author](https://img.shields.io/badge/Author-Otstar%20Lin-blue.svg?style=flat-square)

## 使用方法 Usage

## WSL / WSL2

- 确保安装了 sudo

```sh
# root
apt update && apt install sudo
```

- 按需修改 init.sh 脚本

```sh
# 修改需要的配置
# 设置镜像
setMirrors
# 安装基础应用，在 Ubuntu Core 下大部分应用都没有预装，需要先安装才可进行下列操作
installBase
# 安装 omz，并设置 omz
installZsh
# (Only WSL2) 设置 WSL2 启动脚本，该脚本会安装并设置 systemd，配置自动设置 hosts 等功能
installSetupWsl2
# (Only WSL2) 安装 Docker
installDocker
```

- 如果要安装 systemd，就必须使用非 root 用户

```sh
# 按需执行
adduser <username>
usermod -aG sudo <username>
su <username>
```

- 执行

```sh
# init
./init.sh
```

## 维护者 Maintainer

init-env 由 [Otstar Lin](https://ixk.me/) 和下列 [贡献者](https://github.com/syfxlin/init-env/graphs/contributors) 的帮助下撰写和维护。

> Otstar Lin - [Personal Website](https://ixk.me/) · [Blog](https://blog.ixk.me/) · [Github](https://github.com/syfxlin)

## 许可证 License

![lincense](https://img.shields.io/github/license/syfxlin/init-env.svg?style=flat-square)

根据 MIT License 许可证开源。
