# indi-web

A simple web based INDI control panel.

![INDI Control Panel](doc/screenshot.png "INDI Control Panel")

## Running

```bash
git clone https://github.com/rickbassham/indi-web.git
cd indi-web
docker build -t indi-web:latest .
docker run \
    -e INDI_HOST=host.docker.internal \
    -e INDI_PORT=7624 \
    -p 8081:8081 \
    -it indi-web:latest
```
