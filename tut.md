- Create Dockerfile
  `touch Dockerfile`

- Run and name the image
  `docker build -t node-app-image . `
- To see the list of docker images
  `docker image ls`
- Run image and create the container with node app as its name
  `docker run -p 8000:8000 -d --name node-app node-app-image`
- to see container
  `docker ps`
- to remove a container
  `docker rm -f `

https://youtu.be/bj9QUMRrUdM
