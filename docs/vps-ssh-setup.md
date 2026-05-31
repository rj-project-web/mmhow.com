# VPS：SSH 密钥登录与环境安装

## 你需要准备的信息

云厂商控制台里一般有：

- **公网 IP**：例如 `123.45.67.89`
- **SSH 用户名**：Ubuntu 通常是 `root` 或 `ubuntu`
- **首次密码**（若创建实例时设置了，或控制台「重置密码」）

---

## 一、用 SSH 密钥登录（Mac）

### 方式 1：本机已有 `~/.ssh/id_ed25519`（和 GitHub 同一把）

**1. 把公钥拷到服务器（首次需要密码登录一次）**

```bash
ssh-copy-id -i ~/.ssh/id_ed25519.pub root@你的服务器IP
```

若用户名是 `ubuntu`：

```bash
ssh-copy-id -i ~/.ssh/id_ed25519.pub ubuntu@你的服务器IP
```

**2. 之后日常登录**

```bash
ssh root@你的服务器IP
# 或
ssh ubuntu@你的服务器IP
```

**3. 可选：写在 `~/.ssh/config` 里省事**

```bash
nano ~/.ssh/config
```

追加：

```
Host mmhow
  HostName 你的服务器IP
  User root
  IdentityFile ~/.ssh/id_ed25519
```

以后只需：

```bash
ssh mmhow
```

---

### 方式 2：云厂商控制台粘贴公钥（推荐，不用密码）

1. 本机查看公钥：

```bash
cat ~/.ssh/id_ed25519.pub
```

2. 在云控制台：**实例 → SSH 密钥 / Security → SSH Keys → 添加**  
   粘贴整行 `ssh-ed25519 AAAA... jianglanbo@gmail.com`

3. 创建实例时绑定该密钥，或给已有实例「绑定密钥」后重启。

4. 登录：

```bash
ssh root@你的服务器IP
```

---

### 方式 3：仍只能用密码

```bash
ssh root@你的服务器IP
```

输入控制台密码。登录成功后建议立刻配置密钥：

```bash
mkdir -p ~/.ssh
chmod 700 ~/.ssh
nano ~/.ssh/authorized_keys
# 粘贴本机 id_ed25519.pub 整行，保存

chmod 600 ~/.ssh/authorized_keys
```

---

## 二、登录后：检查环境

在服务器上执行：

```bash
# 系统版本
lsb_release -a

# 是否已安装常用软件
which git node npm docker nginx pm2 2>/dev/null
node -v 2>/dev/null
docker -v 2>/dev/null

# 内存与磁盘
free -h
df -h

# 防火墙
sudo ufw status 2>/dev/null || true
```

---

## 三、一键安装（Ubuntu）

**方法 A — 已 clone 仓库：**

```bash
cd /var/www/mmhow/app   # 或你的 clone 路径
bash scripts/server-bootstrap.sh
```

**方法 B — 只拷脚本：**

本机执行：

```bash
scp scripts/server-bootstrap.sh root@你的服务器IP:/tmp/
ssh root@你的服务器IP 'bash /tmp/server-bootstrap.sh'
```

脚本会安装：git、Node 20、Docker、Nginx、Certbot、PM2，并开放 22/80/443。

若提示 docker 权限，执行 `exit` 重新 SSH 登录一次（`docker` 用户组生效）。

---

## 四、安装完成标准

在服务器上应看到类似：

```text
node: v20.x.x
npm:  10.x.x
Docker version ...
nginx version ...
pm2 5.x
```

且：

```bash
sudo ufw status
# 22, 80, 443 为 ALLOW
```

---

## 五、常见问题

| 现象 | 处理 |
|------|------|
| `Permission denied (publickey)` | 公钥未加到服务器 `authorized_keys` 或云控制台未绑定密钥 |
| `Connection timed out` | 检查安全组是否放行 **22**；IP 是否正确 |
| `root@... Permission denied` | 换用户 `ubuntu@IP`；看厂商文档默认用户 |
| `docker: permission denied` | `sudo usermod -aG docker $USER` 后重新 SSH |
| `npm run build` 内存不足 | VPS 升到 4GB+ 或加 swap |

---

## 六、装完环境后的下一步

```bash
sudo mkdir -p /var/www/mmhow
sudo chown $USER:$USER /var/www/mmhow
cd /var/www/mmhow
git clone git@github.com:你的用户名/mmhow.com.git app
cd app
docker compose up -d
# 配置 .env → npm ci → build → pm2
```

详见 [deploy-production.md](./deploy-production.md)。
