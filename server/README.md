## Sistemas operativos 2


```
docker build -t social-server .
docker tag social-server cgomez29/social-server:v1
docker push cgomez29/social-server:v1
docker run -d -p 0.0.0.0:4000:4000 --name=social-server cgomez29/social-server:v1

https://github.com/actions/setup-go
```
