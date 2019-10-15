<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style lang="scss">
$color: pink;
* {
  margin: 0;
  padding: 0;
}

// body {
//   background-color: $color;
//   h1 {
//     font-size: 50px;
//     color: red;
//   }
// }
html, body, #app {
  width: 100%;
  height: 100%;
}
</style>
