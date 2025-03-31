# photobooth-frontend

The frontend of my Photobooth project.  

## Introduction

This is the frontend for my photobooth project used at my wedding.  
It is a Vue application that communicates with the backend via REST / WebSocket (poor man's MJPG).  
  
It's suggested to look at the slides [photobooth.slides.denv.it](https://photobooth.slides.denv.it) to understand the project better.

A demo of the frontend is available (in form of a video) [here](https://www.youtube.com/watch?v=T_pq31WiOo8).

## Requirements

- [lightd](https://github.com/denysvitali/lightd) to control the LEDs
- [photobooth-server](https://github.com/denysvitali/photobooth-server) to control the camera
- Eventually [photobooth-os](https://github.com/denysvitali/photobooth-os) as the OS
  
## Installation

```
yarn
yarn build
```

## Development

```
yarn dev
```

