<template>
<div id="app">
{{ AudioName }}
{{userAudioAddress}}
{{playAudio}}
  <div>
    <b-form  @submit.stop.prevent>

        <label for="feedback-user">Text to send</label>

        <b-form-input v-model="userText" :state="fitORNot" id="feedback-user"
        @input=" playAudio = false "

        @keypress.enter="postAudio()"
        ></b-form-input>

        <b-form-invalid-feedback :state="fitORNot">
          Text length shoud be more when 10 characters
        </b-form-invalid-feedback>

        <b-form-valid-feedback :state="fitORNot">
          Ready to send
        </b-form-valid-feedback>

        Language Selected : {{languages[userLanguageSelect]}} 

    </b-form>


    <div class="inline">

      <b-dropdown 
      id="dropdown-1" text="Choose Language" class="m-md-2"
      variant="success"
      > 
        <b-dropdown-item v-for="(language, index) in languages" :key="language" 
        @click=" userLanguageSelect = index  "
        >{{index}}.{{language}}
        </b-dropdown-item>

      </b-dropdown>

      <b-button variant="success"
      style="margin-left: 20px"
      @click="postAudio()"
      :disabled=" userText.length < 10 || userText.length > 120 "
      >
        Get 
      </b-button> 

        <div class="inline"
        v-if=" userText == '' && playAudio "
        >

            <audio 
            id="userAudio"
              controls 
              style="margin-left: 20px; margin-bottom : -17px"
            >
            <source
            id="mp3_src"
            >
            Your browser does not support the audio element.
            </audio>

            <b-button variant="outline-primary"
            style="margin-left: 20px"
            @click="downloadFile()"
            >
              Download
            </b-button> 

        </div>

      </div>

  </div>

</div>
</template>

<script>
import axios from 'axios';

export default {

  name: 'App',
  components: {
    
  },

  data() {

    return {
      serverAddress : 'http://localhost:3000/message/',
      userText : '' ,
      userAudioAddress : null ,
      AudioName : null,
      playAudio : false,
      updateAudioSrc : false,
      tryToUpdateSrc : 0,
      maxTryToUpdateSrc : 1,

      userLanguageSelect : 1,
      languages : [ 'English' , 'Russian' , 'Italian' , 'German' ],
      laguagesShortcuts : [ 'en' , 'ru' , 'it' , 'de' ]

    }

  },

  methods:{
    postAudio(){
      if(this.userText.length >= 10 || this.userText.length <= 120)
      {
        this.playAudio = true

        axios.post( "http://localhost:3000/message" , { "text" :  this.userText , "language" : this.laguagesShortcuts[this.userLanguageSelect] , "savefilename" : this.AudioName } )

        .then(response => { if(response.status){ this.userText = '' , this.tryToUpdateSrc = 0 }})

        //this.userAudioFile = 'http://localhost:3000/message/' 
      }


    },

    swapRadioMode(){

      if(this.playAudio == false)
      {
      this.playAudio = true
      }

      if(this.playAudio == true)
      {
      this.playAudio = false
      }

    },

    updateAudio(){
    
      document.getElementById("mp3_src").src = this.userAudioAddress ;
      document.getElementById("userAudio").load();

    },

    updateAudioName(){

      this.AudioName = ( ( ( 1+Math.random() ) * 0x10000 ) | 0 ).toString( 16 ).substring( 1 ) + ( ( ( 1+Math.random() ) * 0x10000 ) | 0 ).toString( 16 ).substring( 1 )
      this.userAudioAddress = ( this.serverAddress + this.AudioName )

    },



    downloadFile(){
        axios.get( this.userAudioAddress , {responseType: 'blob'}).then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', ( ( ( 1+Math.random() ) * 0x10000 ) | 0 ).toString( 16 ).substring( 1 ) + '.mp3'); //or any other extension
            document.body.appendChild(link);
            link.click();
        });
    },

  },

  created: function () {

    setInterval(() => {

      if(!this.playAudio)
      {
        //this.updateAudio()
        this.updateAudioName()

        ///this.updateAudio()

        //this.$forceUpdate();

        
        
      }

      if(this.playAudio && this.userText == '' , this.tryToUpdateSrc < this.maxTryToUpdateSrc )
      {

        this.updateAudio()
 
        this.tryToUpdateSrc ++

      }

      
    }, 1000 ) 



  },

  computed: {

    fitORNot() {
      return this.userText.length > 10 && this.userText.length < 120
    }

  },

  mounted(){


  }
}
</script>

<style>

.inline{
  display: inline; 
  width: 100px;
  height: 100px;
  padding: 10px;
}
</style>
