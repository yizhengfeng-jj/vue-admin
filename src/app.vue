<template>
  <router-view></router-view>
</template>
<style type='text/css'>
body {
  margin: 0;
  padding: 0;
}
</style>
<script>
import store from './store';

export default {
  name: "App",
  store
};
</script>