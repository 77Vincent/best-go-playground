# Go Sandbox - An Advanced Online Golang Editor

https://www.go-sandbox.org/

<img src="https://private-user-images.githubusercontent.com/12905966/428267341-0ab8dd88-51a5-4920-a1c9-2112f60959c5.png?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3NDMyMjUxOTQsIm5iZiI6MTc0MzIyNDg5NCwicGF0aCI6Ii8xMjkwNTk2Ni80MjgyNjczNDEtMGFiOGRkODgtNTFhNS00OTIwLWExYzktMjExMmY2MDk1OWM1LnBuZz9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPUFLSUFWQ09EWUxTQTUzUFFLNFpBJTJGMjAyNTAzMjklMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjUwMzI5VDA1MDgxNFomWC1BbXotRXhwaXJlcz0zMDAmWC1BbXotU2lnbmF0dXJlPWU0MDkxZTUxM2FlNGQyY2I1M2Q3OTc1OWE1NzUyOWRkM2E4Y2IwNjY2YmJjNWY2NjZmMGZiNmUxM2E5ZDVkNzMmWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0In0.iZDQfCae4av00XEwhypLVCzj1xBVLF5VtcKX1BnfEXY"/>

## Features

### Core

- Automatic Realtime Execution
- Overload protection

### UI/UX

- VIM and EMACS Keybindings
- Syntax Highlighting
- Code templating and sharing
- Dark mode

## Development

### Prerequisites

- Node.js
- Docker

### Client

```bash
cd client && npm install && npm run dev
```

or if you have installed once, then

```bash
make client
```

### Server

```bash
make server
```

## Test

### Client

```bash
cd client && npm run test
```

### Server

```bash
make test
```
