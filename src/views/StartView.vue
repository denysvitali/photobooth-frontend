<script setup lang="ts"></script>

<template>
  <main>
    <div class="background-image"></div>
    <h1 class="main-title">Tutorial</h1>
    <p class="tutorial-steps">
    <ol>
      <li>Gather some people</li>
      <li>Put on some funny accessories</li>
      <li>Click on "Start"</li>
    </ol>
    <br />
    After you've taken the picture, it will be automatically uploaded to Google Photos.
    </p>
    <VBtn append-icon="mdi-camera" class="start-button" color="primary" size="x-large" to="/take-picture">Start</VBtn>
  </main>
</template>

<style lang="scss" scoped>
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
    background-size: cover;
    $blurRadius: 5px;
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

  p.tutorial-steps {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    row-gap: 1rem;
    margin-top: 1rem;
    margin-bottom: 2rem;
    font-size: 1.2rem;
  }

  .start-button {
    min-height: 3rem;
    min-width: 8rem;
  }
}
</style>
