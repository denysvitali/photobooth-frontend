<script setup lang="ts"></script>

<template>
  <main>
    <div class="background-image"></div>
    <img src="/public/logo.png" class="logo" />
    <h1 class="main-title">Photobooth</h1>
    <p class="introduction">Grab some accessories, get ready and press "Start"</p>
    <VBtn append-icon="mdi-forward" class="start-button" color="primary" size="x-large" to="/start"
      >Start</VBtn
    >
  </main>
</template>

<style lang="scss" scoped>
$tiffanyBlue: #0abab5;
main {
  display: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;

  div.background-image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: linear-gradient(#2da0e23f, #00000067), url('/public/background-1.jpg');
    background-size: cover;
    $blurRadius: 2px;
    filter: blur($blurRadius);
    -webkit-filter: blur($blurRadius);
    z-index: 0;
  }

  * {
    z-index: 1;
  }

  $shadow: 2px 2px 3px #134746;

  img.logo {
    width: 10rem;
    filter: drop-shadow($shadow);
  }

  h1.main-title {
    font-family: 'Dancing Script', cursive;
    color: #09b9b4;
    text-shadow: $shadow;
    font-size: 4rem;
    margin-top: -2rem;
  }

  p.introduction {
    margin-top: 1rem;
    margin-bottom: 2rem;
    font-size: 1.2rem;
    text-shadow: 2px 2px 8px #000;
  }

  .start-button {
    min-height: 3rem;
    min-width: 8rem;
  }
}
</style>
