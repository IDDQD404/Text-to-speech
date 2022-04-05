<template>
<div class="hello">

    <h1>{{ link }}</h1>

    <audio controls>
      
    <source src = "http://localhost:3000/message/Audio" type="audio/mp3">
    Your browser does not support the audio element.
    </audio>

</div>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    link: String
  }
}
</script>

<style scoped>

</style>
