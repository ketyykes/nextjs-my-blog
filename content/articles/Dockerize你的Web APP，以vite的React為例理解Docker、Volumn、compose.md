---
title: Dockerize 你的 Web APP，以 vite 的 React 為例理解 Docker、Volume、compose
slug: 2024-01-27T06:10:23.000Z
date: 2024-01-27T06:10:23.000Z
tags: ["Docker","Backend"]
---

<style> 
.rem25{
font-size:2.5rem;
}
.rem40{
font-size:4.0rem;
}
.rem50{
  font-size:5.0rem;
}
@media (max-width: 576px) {
  .rem25{
    font-size:2rem;
  }
  .rem40{
    font-size:3.0rem;
  }
  .rem50{
    font-size:3.5rem;
  }
}
.red {
color:red;
}
.blue{
color:blue;
}
.code{
background-color:#e9e9e9;
padding :4px;
font-size:0.9rem;
font-weight:700;
}
</style>



## 目錄
- Docker 簡介
- 實作 docker 前需要知道的以下名詞
  - Docker Engine
  - Docker Hub
  - Docker Image and Container
- Docker 常用指令
- 開始建立專案事前準備
  - 安裝 Docker
  - 建立環境與 WebApp
  - 設定 Vite 開發環境以實現外部對容器訪問 
- Dockerfile 常用關鍵字
- 透過 Dockerfile 建立映像檔與容器
  - Step.1 撰寫 Dockerfile
  - Step.2 撰寫 dockerignore 檔案
  - Step.3 建立映像檔並執行
    - 建構映像
    - 執行映像檔並建構容器
    - 額外補充：多個 dockerfile
- 什麼是 Volume
  - 使用-v 或 --mount
  - 關於掛載的不同方式
- 透過 Volume 指令綁定容器實現 Docker 環境開發
  - Step.1 設定 Docker 容器可見目錄與權限
  - Step.2 開啟 Docker Desktop
  - Step.3 執行掛載指令
- 什麼是 docker compose
- docker.compose.yml 常見設定
- docker compose 常用指令
- 使用 docker-compose 啟動你的 React App
  - Step.1 撰寫 docker-compose file 
  - Step.2 輸入 docker compose 指令

---

## Docker 簡介

Docker 是一個開源容器化平台，讓開發人員可以將應用程式及其依賴項封裝在容器中。並且可移植性和一致性，讓開發和部署變得更簡單快速。

根據[Docker-維基百科](https://zh.wikipedia.org/zh-tw/Docker)的解釋如下
> Docker 是一個開放原始碼的開放平臺軟體，用於開發應用、交付（shipping）應用和執行應用。Docker 允許使用者將基礎設施（Infrastructure）中的應用單獨分割出來，形成更小的顆粒（容器），從而提高交付軟體的速度。

參考下圖

![圖片](https://www.docker.com/app/uploads/2021/11/container-what-is-container.png)

> 圖片來自[docker 官方文件-container 章節](https://www.docker.com/resources/what-container/)

其中 AppA 和 AppB 和 AppC 可能的舉例像是 Node app、React app、Mongodb 等等的應用程式。

## 實作 docker 前先知道以下名詞

### Docker Engine

![image](https://hackmd.io/_uploads/r1Slb97c6.png)
> 圖片參考來源：[How Do the Docker Client and Docker Servers Work?](https://dzone.com/articles/how-do-the-docker-client-and-docker-serves-work)

- 作為 Docker 的核心，用來建立和容器化你的 client-server 架構的應用程式
- 長時間運行 dockerd 程序的伺服器
- 具有 command line interface (CLI) 與 docker 互動
- 透過相關 API 與 docker daemon(常駐程式) 互動

#### 其他參考資料
> - [官方文件-Docker Engine](https://docs.docker.com/engine/)
> - [daemon - 常駐程式 - Wiki](https://zh.wikipedia.org/zh-tw/%E5%AE%88%E6%8A%A4%E8%BF%9B%E7%A8%8B)
> - [How Do the Docker Client and Docker Servers Work?](https://dzone.com/articles/how-do-the-docker-client-and-docker-serves-work)

### Docker Hub

![image](https://hackmd.io/_uploads/H1AQ_9Xc6.png)
Docker Hub 是 Docker 的官方倉庫（repository）平台，用於分享和管理容器映像檔。

- **映像檔倉庫：**- 提供用戶存儲和分享容器映像檔的平台。
- 公共和私人倉庫：
  - 公共倉庫，任何人都可以下載和使用映像檔。
  - 私人倉庫，用於存儲私人映像檔，只有授權用戶才能訪問。
- **官方映像檔：**：由專業團隊維護和更新，確保品質和安全性。
- **自動化構建：** 支持將 Source Code 倉庫（如 GitHub 或 Bitbucket）與 Docker Hub 連接，自動構建映像檔並推送到 Docker Hub。
- **集成 Docker Engine：**:允許用戶直接從 Docker CLI 拉取和推送映像檔。

#### 其他參考資料

> - [Open Source Container Company Docker Updates Hub for Faster App Delivery](https://adtmag.com/articles/2015/09/18/docker-hub-udpate.aspx)
> - [鐵人賽 Docker 獸 究極進化 ～～ Kubernetes 獸-What is Docker](https://ithelp.ithome.com.tw/articles/10238392?sc=pt)
> - [官方文件-Docker Hub](https://docs.docker.com/docker-hub/)

### Docker Image and Container

想像映像檔 (Image) 是光碟，而執行光碟的地方是容器 Container，例如你有一片安裝防毒軟體的光碟，在 A 電腦安裝後執行該程式，A 電腦就是執行的 Container。

我們在安裝防毒軟體的時候可能會加入一些客製化設定，例如介面是中文、是否安裝其他外掛、是否自動更新防毒資料庫。

Container 在被建立的時候也可以設定例如容器的 Port 映射到宿主主機的 Port 是多少，容器名稱要叫什麼，針對這些容器實體，一但被建立後就無法更改，必須基於映像檔再重新建立。

下圖為基於 Docker file 建構映像檔並且啟動後變成容器實體

![image](https://hackmd.io/_uploads/r1OO95Xq6.png)
> 圖片來源：[A Beginner’s Guide to Understanding and Building Docker Images](https://jfrog.com/devops-tools/article/understanding-and-building-docker-images/)

---

### Docker 常用指令
| 用途                  | 指令                                               | 相關 Options      |
| --------------------- | -------------------------------------------------- | ----------------- |
| 拉取映像檔            | `docker pull NAME[:TAG]`                           |                   |
| 列出映像檔            | `docker images`                                    | -a, --all         |
| 建立映像檔            | `docker build -t TAG .`                            | -t, --tag         |
| 標記映像檔            | `docker tag SOURCE_IMAGE[:TAG] TARGET_IMAGE[:TAG]` |                   |
| 推送映像檔            | `docker push NAME[:TAG]`                           |                   |
| 刪除映像檔            | `docker rmi IMAGE`                                 | -f, --force       |
| 執行容器              | `docker run [OPTIONS] IMAGE [COMMAND] [ARG...]`    | -d, --detach; -p, |
| 列出容器              | `docker ps`                                        | -a, --all         |
| 停止容器              | `docker stop CONTAINER`                            |                   |
| 啟動容器              | `docker start CONTAINER`                           |                   |
| 刪除容器              | `docker rm CONTAINER`                              | -f, --force       |
| 查看容器日志          | `docker logs CONTAINER`                            | -f, --follow      |
| 容器內執行命令        | `docker exec -it CONTAINER COMMAND`                | -it               |
| 查看映像檔/容器詳情   | `docker inspect NAME orID`                         | -f, --format      |
| 查看映像檔歷史記錄    | `docker history IMAGE`                             | --no-trunc        |
| 保存映像檔到 tar 檔案 | `docker save -o <output file path> <image name>`   | -o, --output      |
| 加載 tar 檔案為映像檔 | `docker load -i <input file path>`                 | -i, --input       |

---

## 開始建立專案事前準備

### 安裝 Docker

依據你的作業系統安裝對應的 docker，詳細可以參考[docker-Install Docker Engine](https://docs.docker.com/engine/install/)

在官方網站上面會看到許多版本，我們可以概括成兩種類型
主要分為 Desktop 版本和 Server 版本
其差異如下

**Docker Desktop**：
- 提供了一個用戶 GUI 界面操作容器和觀看容器狀態。
- 工具包含了 Docker Engine、Docker CLI

**Docker Server**：
- 在 Linux 伺服器上運行，並且通過命令行進行操作

如果是在自己的電腦操作就能使用 GUI 介面的 Desktop 版本，反之若在伺服器或者沒有 GUI 操作上就會使用終端機來安裝 Docker Engine

### 建立環境與 WebApp

由於這裡是用 React App 作為範例，所以電腦必須擁有 Node 環境並且安裝相關 package 和建立一個 React App

![image](https://hackmd.io/_uploads/r1k9LjQca.png)

這裡使用 pnpm 建立一個 React App
詳細安裝過程請參考

- [Pnpm 官方網站-Using npm](https://pnpm.io/installation#using-npm)
- [vite 官方網站-Scaffolding Your First Vite Project](https://vitejs.dev/guide/#scaffolding-your-first-vite-project)

```bash
npm install -g pnpm
```

```bash
pnpm create vite 
```

接下來你有一個 Web App 或者透過上述方式得到了一個 Web App 了

### 設定 Vite 開發環境以實現外部對容器訪問

由於現在要建置的是透過 docker 來進行編譯與開發，所以必須讓 vite 的開發環境能讓 docker 容器訪問
因此必須到 vite.config.js 設定如下

```javascript
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()], // 使用 react 插件
  server: {
    host: true, // 容器內的服務監聽所有網卡地址，使其能夠通過容器外部的地址訪問
    strictPort: true, // 確保 Vite 開發伺服器在指定的端口運行，如果該端口已被占用，則直接終止服務
    port: 5173, // 指定 Vite 開發伺服器的端口為 5173，這是 Vite 的默認端口
  },
})
```

1. `host: true`：這是最重要的設置。當在 Docker 容器內運行 Vite 開發服務時，設置 `host: true` 會使開發服務監聽所有網卡的地址 (即 `0.0.0.0`)，而不僅僅是 localhost (`127.0.0.1`)。這意味著你可以從容器外部的主機或其他設備訪問開發服務。
2. `strictPort: true`：這個設置確保如果指定的端口（在這個案例中是 5173）不可用，Vite 會直接終止，而不是嘗試使用另一個端口。這使得端口行為更可預測，尤其是在 Docker 環境中，你可能需要配置端口映射。
3. `port: 5173`：這指定了 Vite 開發伺服器運行的端口。5173 是 Vite 的默認端口。在 Docker 的情況下，你需要確保 Docker 容器的端口映射配置與此設定一致。

---

## Dockerfile 常用關鍵字

簡單說明接下來 dockerfile 常用及稍後會用到的關鍵字

| 關鍵字       | 說明                                                                        |
| ------------ | --------------------------------------------------------------------------- |
| `FROM`       | 設定基礎映像檔，所有後續操作都基於此映像檔。                                |
| `RUN`        | 在映像檔內執行命令，常用於安裝軟體包。                                      |
| `CMD`        | 提供容器啟動時預設要執行的命令。                                            |
| `LABEL`      | 為映像檔添加元數據，如作者、版本等訊息。                                    |
| `EXPOSE`     | 告知 Docker 容器將在運行時監聽指定的端口。                                  |
| `ENV`        | 設定環境變數。可被隨後的`RUN`指令使用，也可在運行容器時使用。               |
| `ADD`        | 複製檔案或目錄到容器中。如果是本地壓縮檔會自動解壓並且支援 URL 地址下載檔案 |
| `COPY`       | 複製新檔案或目錄到容器中。                                                  |
| `ENTRYPOINT` | 配置容器啟動時執行的命令，可與`CMD`配合使用來設定預設參數。                 |
| `VOLUME`     | 創建掛載點目錄，用於存儲卷。                                                |
| `WORKDIR`    | 為`RUN`、`CMD`、`ENTRYPOINT`、`COPY`和`ADD`指令設定工作目錄。               |
| `ARG`        | 定義構建時的變數，可在構建 Docker 映像檔時透過`--build-arg`來指定。         |

## 透過 Dockerfile 建立映像檔與容器

### Step.1 撰寫 Dockerfile

```dockerfile
# 使用 node 版本 20.11 的 alpine 3.18 作為基礎映像檔
FROM node:20.11-alpine3.18 AS base

# 設定工作目錄為 /app，所有後續的命令都會基於此目錄
WORKDIR /app
  
# 複製 package.json 檔案到容器中的 /app 目錄
COPY package.json  ./

# 複製 pnpm-lock.yaml 檔案（如果存在）到容器中的 /app 目錄
COPY pnpm-lock.yaml* ./

# 安裝 pnpm 命令，版本為 8.9
RUN npm install -g pnpm@8.9

# 使用 pnpm 安裝依賴項，根據 pnpm-lock.yaml 文件確保依賴版本的一致性
RUN pnpm install --frozen-lockfile

# 複製當前目錄的所有文件到容器中的 /app 目錄
COPY . .

# 宣告容器運行時監聽的端口號為 5173
EXPOSE 5173

# 容器啟動時執行的命令，啟動開發服務
CMD ["pnpm", "run", "dev"]
```

由於是在基底映像檔中建立你所需要的環境，因此像是 pnpm 這些 package 是不存在於基底映像檔中，所以要記得透過 RUN 指令安裝該 package 包

### Step.2 撰寫 dockerignore 檔案

建立.dockerignore 檔案，用於避免 COPY 或 ADD 指令時將該檔案放入映像檔中

```bash
Dockerfile
.dockerignore
node_modules
npm-debug.log
README.md
.next
.git
```

由於 node_module 將會透過 npm 安裝後產生，因此無需將其複製到映像檔中。

最後資料夾內容將呈現如下

```bash
├── Dockerfile
├── README.md
├── index.html
├── package.json
├── pnpm-lock.yaml
├── public
│   └── vite.svg
├── src
│   ├── App.css
│   ├── App.jsx
│   ├── assets
│   │   └── react.svg
│   ├── index.css
│   └── main.jsx
└── vite.config.js
```

### Step.3 建立映像檔並執行


撰寫完畢後我們輸入以下兩個指令

```bash
docker build -t my-react:dev .
```

```bash
docker run --name my-react-container3000 -d -p 3000:5173 my-react:dev
```
#### **構建映像**

使用 `docker build` 命令來構建一個映像。你需要在包含 `Dockerfile` 的目錄中執行此命令。
命令的一般形式如下：

```bash
docker build -t <你的映像名稱>:<標籤> .
```
- -t 參數允許你為映像指定一個名稱和標籤，通常的形式是 `name:tag`，比如 `myapp:1.0`。
- 最後的 `.` 指的是 Dockerfile 所在的當前目錄。如果 Dockerfile 在其他路徑，你需要指定正確的路徑。

#### **執行映像檔建構容器**
當映像構建完成後，你可以使用 `docker run` 命令來運行映像：

```bash
docker run --name <命名容器名稱> -d -p <主機端口>:<容器端口> <你的映像名稱>:<標籤>
```

- `-d` 參數表示容器在後台運行。
- `-p` 參數用於將容器內的端口映射到你的主機的端口上。
- `<主機端口>` 是你機器上的端口號，`<容器端口>` 是容器內部的端口號。
- `<你的映像名稱>:<標籤>` 是你之前構建的映像的名稱和標籤。`
- `--name` 表示你可以替容器命名的 

##### 額外補充：多個 dockerfile

如果你有一個特定的 `Dockerfile`，名稱不是預設的 `Dockerfile`，比如說 `Dockerfile.dev`，並且你想要使用它來構建一個 Docker 映像，你可以使用 `-f` 或 `--file` 選項指定 `Dockerfile` 路徑。以下是相應的指令：

```bash
docker build -f Dockerfile.dev -t [你的映像名稱]:[標籤] .
```

- `-f Dockerfile.dev` 指定了要使用的 Dockerfile 路徑和名稱。
- `-t [你的映像名稱]:[標籤]` 允許你為構建的映像指定名稱和標籤。
- 最後的 `.` 指的是 Dockerfile 所在的當前目錄。如果你的 Dockerfile 位於其他目錄，你需要指定正確的路徑。

舉例來說，如果你想構建一個名為 `my-react`，標籤為 `dev` 的映像，你可以這樣寫：

```bash
docker build -f Dockerfile.dev -t my-react:dev .
```

## 什麼是 Volume

卷（Volume）是 Docker 用於實現數據持久化和存儲的一種機制，它允許數據在容器重啟或刪除後依然存在。卷由 Docker 宿主機管理，與容器的生命週期獨立，並且可以被多個容器掛載和共享。

![image](https://hackmd.io/_uploads/H1SFpnm56.png)


如果你想要在啟動 Docker 容器時，將你主機上的某個目錄（例如 `/path/to/host/src`）掛載到容器內的某個目錄（例如 `/path/in/container/src`），你可以使用 Docker 的 `-v` 或 `--mount` 選項來進行 bind mount。：

### 使用 -v 或 --mount 指令

**使用 `-v` 選項**:
   ```bash
   docker run -v /path/to/host/src:/path/in/container/src [其他選項] [映像名稱]
   ```
   這裡，`/path/to/host/src` 是你主機上的目錄，`/path/in/container/src` 是容器內的目錄。這個命令會將主機上的 `/path/to/host/src` 目錄掛載到容器的 `/path/in/container/src` 目錄。

**使用 `--mount` 選項**（更為明確和推薦的方式）:
   ```bash
   docker run --mount type=bind,source=/path/to/host/src,target=/path/in/container/src [其他選項] [映像名稱]
   ```
   這裡，`type=bind` 表示這是一個 bind mount，`source=/path/to/host/src` 指定了主機上的源目錄，`target=/path/in/container/src` 指定了容器內的目標掛載點。

> 在這兩個例子中，`[其他選項]` 可以是你想要添加的其他 `docker run` 選項，例如 `-d` 來在後臺運行容器，或 `-p` 來映射端口等。`[映像名稱]` 是你要啟動的 Docker 映像的名稱。

### 關於掛載的不同方式
Docker 中的支持不同的 `type`，用於指定掛載的類型。通常有以下三種主要的 `type`：

- **volume：** 使用 `--mount` 並指定 `type=volume` 可以創建一個卷（Volume）並將其掛載到容器中。這個卷可以是 Docker 管理的卷，並在宿主機上進行管理。
- **bind：** 使用 `--mount` 並指定 `type=bind` 可以進行綁定掛載，將宿主機上的目錄或文件掛載到容器中。這使得容器可以訪問宿主機上的文件系統。
- **tmpfs：** 使用 `--mount` 並指定 `type=tmpfs` 可以將一個 tmpfs（暫時文件系統）掛載到容器中，這在需要暫時性文件系統時非常有用，例如，避免在容器中永久保存數據。

其他參考資料
> - [Docker volumes 教學 - 從不熟到略懂](https://myapollo.com.tw/blog/docker-volumes/)
> - [官方文件 - Manage data in Docker](https://docs.docker.com/storage/)

## 透過 Volume 指令綁定容器實現 Docker 環境開發

### Step.1 設定 Docker 容器可見目錄與權限

根據不同的作業系統，以 Mac 為例必須允許 docker 讀取本機的檔案權限

### Step.2 開啟 Docker Desktop

開啟 Docker Desktop 

1. 點擊齒輪圖標 打開 "Settings"。
2. 轉到 "Resources" 部分。 
3. 在 "File Sharing" 添加你希望對 Docker 容器可見的目錄。在你的情況下，添加 `/src` 目錄。
4. 應用更改並重啟 Docker Desktop。

如下圖
![截圖 2024-01-27 下午 5.09.56](https://hackmd.io/_uploads/rJh_YrG9a.png)
  
### Step.3 執行掛載指令

執行以下程式碼

```bash
docker run -v ./src:/app/src -d -p 3000:5173 my-react:dev
```

接下來就可以嘗試著改動 src 的檔案看看並且連接到 3000port 就能實現在 Docker 環境內開發了



## 什麼是 Docker Compose

當我們有多個映像檔或者 dockerfile 的時候，我們希望有執行順序並且免除每次一直繁瑣的打指令時可以建立一個 docker compose 來簡化步驟並設定所有映像檔需要建立的容器指令，例如 port 映射、volume 位置等等

## docker compose yml 常見設定

| 用途                   | 指令          | 描述                                                            | 範例                          |
| ---------------------- | ------------- | --------------------------------------------------------------- | ----------------------------- |
| 定義服務容器           | `services`    | 設定應用程式的容器服務，可以是一個或多個。                      | `services: web: image: nginx` |
| 建立容器的環境變數     | `environment` | 為服務設定環境變數。支援單行或陣列格式。                        | `environment: - DEBUG=1`      |
| 映射容器與宿主機的端口 | `ports`       | 將容器的端口映射到宿主機的端口。格式為 "宿主機端口：容器端口"。 | `ports: - "5000:5000"`        |
| 掛載卷，資料持久化     | `volumes`     | 在宿主機和容器之間掛載資料卷或者掛載點。                        | `volumes: - ./data:/data`     |
| 定義容器間的依賴關係   | `depends_on`  | 定義服務的啟動順序，確保依賴的服務先啟動。                      | `depends_on: - db`            |
| 設定容器重啟策略       | `restart`     | 設定容器的重啟策略，如 "always" 表示總是重啟。                  | `restart: on-failure`         |
| 容器建構設定           | `build`       | 指定 Dockerfile 所在的路徑，用於建構映像檔。                    | `build: ./dir`                |
| 設定容器的網路         | `networks`    | 定義和配置內部網路。                                            | `networks: - net1`            |

## docker compose 常用指令

| 用途                 | 指令                                | 描述                                           |
| -------------------- | ----------------------------------- | ---------------------------------------------- |
| 啟動服務             | `docker-compose up`                 | 啟動 Docker Compose 定義的所有服務。           |
| 啟動服務（背景執行） | `docker-compose up -d`              | 在背景中啟動 Docker Compose 定義的所有服務。   |
| 停止服務             | `docker-compose down`               | 停止 Docker Compose 定義的所有服務並移除容器。 |
| 重建服務             | `docker-compose up --build`         | 重建並啟動 Docker Compose 定義的所有服務。     |
| 查看服務狀態         | `docker-compose ps`                 | 查看 Docker Compose 定義的服務的運行狀態。     |
| 查看服務日誌         | `docker-compose logs [服務名稱]`    | 查看 Docker Compose 定義的服務的日誌輸出。     |
| 執行命令             | `docker-compose exec 服務名稱 命令` | 在指定服務中執行特定命令。                     |
| 暫停服務             | `docker-compose pause 服務名稱`     | 暫停指定服務的運行。                           |
| 恢復服務             | `docker-compose unpause 服務名稱`   | 恢復指定服務的運行（從暫停狀態）。             |

## 使用 docker-compose 啟動你的 React App

### Step.1 撰寫 docker-compose file

docker-compose.yaml 配置與說明如下

```yaml
version: '3'
services:
  my-react-services:
    build:                     # 新增的部分，指定如何構建映像
      context: .               # 指定 Dockerfile 所在的上下文目錄，這裡是當前目錄
      dockerfile: Dockerfile.dev   # 指定使用的 Dockerfile 名稱
    volumes:
      - .:/app                 # 掛載當前目錄到容器的 /app
      - /app/node_modules      # 建立一個匿名的卷，讓 node_modules 資料夾不會被 host 覆蓋
    ports:
      - '3000:5173'            # 映射容器的 5173 端口到主機的 3000 端口
    command: pnpm run dev      # 容器啟動後要執行的命令
    restart: always            # 容器退出時的重啟策略
```

### Step.2 輸入 docker compose 指令

```bash
docker-compose up --build
```

- `docker-compose up`: 這是 Docker Compose 的主要命令之一，用於啟動和運行你在 `docker-compose.yml` 文件中定義的所有服務。如果服務中引用的映像尚未下載，Docker Compose 會自動拉取這些映像。
- `--build`: 這個選項會告訴 Docker Compose 在啟動服務之前先構建（或重建）映像。這尤其有用於開發環境，當你更改了 Dockerfile 或相關的構建文件並希望這些更改被包括在新啟動的容器中時。

使用這個命令時，Docker Compose 會進行以下操作：

1. **自動構建或重建映像**：根據你的 `docker-compose.yml`（和任何相關的 `docker-compose.override.yml`）文件中的 `build` 配置，Docker Compose 會構建或重建服務所需的映像。如果 `docker-compose.yml` 文件中的服務指定了 `build` 路徑，那麼對應的 Dockerfile 將被用來構建映像。
2. **創建並啟動容器**：構建完成後，Docker Compose 會創建並啟動所有服務所定義的容器。這包括配置任何網絡、掛載 volumes 和啟動你在 `docker-compose.yml` 文件中定義的容器。
3. **服務依賴性管理**：如果你的服務之間有依賴關係，Docker Compose 會以正確的順序啟動它們。

