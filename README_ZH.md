# Unstructured API Nuxt 封装项目

## 使用步骤

在启动 Docker 容器服务之前，请按照以下步骤操作：

1. **创建 `.env` 文件**：在项目根目录下新建一个 `.env` 文件，用于存储 Unstructured API 的配置信息。

2. **添加配置信息**：在 `.env` 文件中添加以下内容，替换 `your_unstructured_host` 和 `your_unstructured_api_key` 为实际的 HOST 和 API_KEY 值：

   ```
   UNSTRUCTURED_API_HOST=your_unstructured_host
   UNSTRUCTURED_API_KEY=your_unstructured_api_key
   ```

   例如：
   ```
   UNSTRUCTURED_API_HOST=https://api.unstructured.io
   UNSTRUCTURED_API_KEY=abc123def456
   ```

3. **启动 Docker 容器**：使用以下命令根据需要启动容器：

   - 仅启动本项目：
     ```bash
     docker-compose up
     ```
   - 同时启动 Unstructured API 服务和本项目：
     ```bash
     docker-compose -f docker-compose-full.yaml up
     ```

4. **访问应用**：启动容器后，通过公开的端口（默认 `http://localhost:3000`）访问应用。

## Docker 快速启动

我们提供了 `Dockerfile` 和两个 `docker-compose` 配置文件，帮助您快速启动项目。

- `docker-compose.yaml`：仅启动本项目。
- `docker-compose-full.yaml`：同时启动额外的 Unstructured API 服务和本项目。

### Docker 设置

1. **安装 Docker**：确保已安装 Docker。如果没有，可从 [Docker 官网](https://www.docker.com/) 下载。

2. **构建 Docker 镜像**：
   ```bash
   docker-compose build
   ```

3. **启动项目**：按照上述使用步骤启动 Docker 容器。

## 开发与生产

开发过程中的代码更改将自动同步到 Docker 容器中。生产部署时，构建 Docker 镜像并运行它们，具体命令请参考使用步骤。

## 贡献与许可

欢迎贡献代码或反馈问题。本项目遵循 [LICENSE](LICENSE) 许可。

---

享受使用 Nuxt 3 封装的 Unstructured API 的灵活性和强大功能。更多 Unstructured API 信息，请访问 [官方仓库](https://github.com/Unstructured-IO/unstructured-api)。
