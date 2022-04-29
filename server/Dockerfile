FROM golang:1.16.2-alpine3.13
WORKDIR /app/src
ENV GOPATH=/app
COPY go.mod /app/src
RUN go mod download
COPY . /app/src
EXPOSE 4000
CMD ["go", "run", "main.go"]