# FastAPI

FastAPI 是一个基于 Python 3.7+ 的现代、快速（高性能）Web 框架，适合构建 API、Web 服务和微服务。它以类型注解为核心，自动生成文档，支持异步、依赖注入、数据校验等特性。

---

## 1. 安装

推荐使用 pip 安装：

```bash
pip install fastapi[all]
```

- `[all]` 会自动安装 Uvicorn（推荐的 ASGI 服务器）、Pydantic、Jinja2 等依赖。

---

## 2. 快速上手

新建 main.py：

```python
from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Hello, FastAPI!"}
```

启动服务：

```bash
uvicorn main:app --reload
```

- `--reload` 支持热重载，开发时建议开启。
- 访问 http://127.0.0.1:8000 查看接口。
- 访问 http://127.0.0.1:8000/docs 查看自动生成的 Swagger 文档。

---

## 3. 路由与请求方法

```python
from fastapi import FastAPI

app = FastAPI()

@app.get("/items/{item_id}")
def get_item(item_id: int):
    return {"item_id": item_id}

@app.post("/items/")
def create_item(name: str):
    return {"name": name}
```

- 支持 GET、POST、PUT、DELETE、PATCH 等 HTTP 方法。
- 路径参数、查询参数、请求体参数自动解析。

---

## 4. 请求参数与数据校验

使用 Pydantic 定义数据模型：

```python
from fastapi import FastAPI
from pydantic import BaseModel

class Item(BaseModel):
    name: str
    price: float
    tags: list[str] = []

app = FastAPI()

@app.post("/items/")
def create_item(item: Item):
    return item
```

- 自动校验类型、必填项、默认值。
- 请求体自动转为 Pydantic 对象。

---

## 5. 响应与状态码

```python
from fastapi import FastAPI, status
from pydantic import BaseModel
from fastapi.responses import JSONResponse

class Result(BaseModel):
    code: int
    msg: str

app = FastAPI()

@app.get("/ok", response_model=Result)
def ok():
    return Result(code=0, msg="success")

@app.get("/custom")
def custom():
    return JSONResponse(content={"msg": "custom"}, status_code=status.HTTP_201_CREATED)
```

- 可指定 response_model 自动文档化响应结构。
- 可自定义状态码、响应头。

---

## 6. 路径参数、查询参数、请求体

```python
from fastapi import FastAPI, Query, Path

app = FastAPI()

@app.get("/users/{user_id}")
def get_user(user_id: int = Path(..., gt=0), q: str = Query(None, max_length=20)):
    return {"user_id": user_id, "q": q}
```

- Path/Query 可设置校验规则、默认值、描述等。

---

## 7. 依赖注入（Depends）

```python
from fastapi import FastAPI, Depends

def get_token():
    return "token123"

app = FastAPI()

@app.get("/secure")
def secure(token: str = Depends(get_token)):
    return {"token": token}
```

- 支持函数依赖、类依赖、全局依赖。
- 适合做认证、数据库连接、通用参数等。

---

## 8. 中间件

```python
from fastapi import FastAPI, Request
from starlette.middleware.base import BaseHTTPMiddleware

app = FastAPI()

class SimpleMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        print(f"请求: {request.url}")
        response = await call_next(request)
        return response

app.add_middleware(SimpleMiddleware)
```

- 可用于日志、跨域、认证、性能监控等。

---

## 9. 异步支持

```python
from fastapi import FastAPI
import asyncio

app = FastAPI()

@app.get("/async")
async def async_route():
    await asyncio.sleep(1)
    return {"msg": "async done"}
```

- 支持 async def，适合高并发、IO 密集型场景。

---

## 10. 常见问题

- **接口 404/405**：检查路由方法、路径、参数类型是否一致。
- **自动文档打不开**：确认安装了 `fastapi[all]`，依赖齐全。
- **跨域问题**：可用 `from fastapi.middleware.cors import CORSMiddleware` 添加 CORS 中间件。
- **中文响应乱码**：建议统一使用 UTF-8 编码，或设置 response_class。
- **生产部署**：推荐用 Uvicorn + Gunicorn，或 Docker 部署。

---

## 11. 参考链接

- [FastAPI 官方文档](https://fastapi.tiangolo.com/zh/)
- [Pydantic 官方文档](https://docs.pydantic.dev/)
- [Uvicorn 官方文档](https://www.uvicorn.org/)

---

## 12. 数据库集成

FastAPI 常用数据库集成方式有：

### 12.1 SQLAlchemy（同步）

```python
from fastapi import FastAPI, Depends
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session

SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)

Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

app = FastAPI()

@app.post("/users/")
def create_user(name: str, db: Session = Depends(get_db)):
    user = User(name=name)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user
```

- 推荐用 Depends 注入 db 会话，避免线程安全问题。
- 支持 SQLite、MySQL、PostgreSQL 等。

### 12.2 异步数据库（async SQLAlchemy, Tortoise ORM 等）

#### async SQLAlchemy 2.x 示例：

```python
from fastapi import FastAPI, Depends
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy import Column, Integer, String, select

DATABASE_URL = "sqlite+aiosqlite:///./test.db"
engine = create_async_engine(DATABASE_URL, echo=True)
AsyncSessionLocal = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)

async def get_db():
    async with AsyncSessionLocal() as session:
        yield session

app = FastAPI()

@app.post("/users/async")
async def create_user(name: str, db: AsyncSession = Depends(get_db)):
    user = User(name=name)
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user
```

#### Tortoise ORM 示例：

```python
from fastapi import FastAPI
from tortoise.contrib.fastapi import register_tortoise
from tortoise import fields, models

app = FastAPI()

class User(models.Model):
    id = fields.IntField(pk=True)
    name = fields.CharField(max_length=50)

register_tortoise(
    app,
    db_url="sqlite://db.sqlite3",
    modules={"models": [__name__]},
    generate_schemas=True,
    add_exception_handlers=True,
)

@app.post("/users/tortoise")
async def create_user(name: str):
    user = await User.create(name=name)
    return user
```

---

### 12.3 常见问题

- **同步/异步混用报错**：同步 SQLAlchemy 不能在 async 路由中用，反之亦然。
- **会话未关闭**：推荐用 Depends 注入 db，自动管理生命周期。
- **多线程/多进程**：SQLite 用 connect_args，生产建议用 MySQL/PostgreSQL。
- **模型自动生成表**：Base.metadata.create_all(bind=engine) 仅开发用，生产建议用 Alembic 迁移。

---