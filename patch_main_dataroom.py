import re

with open("backend/main.py", "r") as f:
    content = f.read()

if "from routes import data_room" not in content:
    # Add import
    content = content.replace("from routes import auth", "from routes import auth, data_room")
    
    # Add router
    router_string = 'app.include_router(data_room.router, prefix="/data-room", tags=["Data Room"])'
    
    if router_string not in content:
        content = content.replace('app.include_router(auth.router, prefix="/auth", tags=["Auth"])', 'app.include_router(auth.router, prefix="/auth", tags=["Auth"])\n    ' + router_string)

    with open("backend/main.py", "w") as f:
        f.write(content)
