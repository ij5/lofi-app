<script lang="ts">
  import { Dialogs, Http } from "@nativescript/core";
  import { TNSPlayer } from "nativescript-audio";
  import { onMount } from "svelte";
  import './home.css';

  let state: 'playing'|'loading'|'paused'|'muted' = 'paused';

  let current: any;
  let audio = new TNSPlayer();

  let gifs: any;
  async function updateCurrent() {
    current = await Http.getJSON("https://radio.lo-fi.click/current");
  }
  async function updateGif() {
    gifs = await Http.getJSON("https://radio.lo-fi.click/gif");
  }
  let now = Date.now();
  onMount(() => {
    updateCurrent();
    updateGif();
    setInterval(()=>{
      now = Date.now();
      updateCurrent();
    }, 5000);
    setInterval(updateGif, 1000 * 60 * 3);
  });
    
  let message: string = "Hello World";
</script>

<page>
  <actionBar backgroundColor="black">
    <stackLayout orientation="horizontal">
      <label color="white" text="{new Date(now).getHours()}:{new Date(now).getMinutes()}" fontSize="20" verticalAlignment="center" horizontalAlignment="left" />
    </stackLayout>
  </actionBar>
  <absoluteLayout>
    <image width="100%" height="100%" src="{gifs?gifs.url:""}" stretch="aspectFill" />
    <flexboxLayout
      top="0"
      left="0"
      width="100%"
      height="100%"
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
      backgroundColor="transparent"
    >
      <flexboxLayout class="player" flexDirection="column" backgroundColor="#fbf4e6" width="80%" style="border-radius: 30dpi;">
        {#if current}
            <label text="{current.title}" />
            <progress value="{((now - current.time) / (current.duration * 1000)) * 100}" color="black" marginBottom="20dpi" marginTop="20dpi" />
            <button text="{state==='playing'?'Pause':state==='paused'?'Play':state==='muted'?'Play':state==='loading'?'Loading...':''}" class="btn" on:tap={()=>{
                if(state === 'paused') {
                    state = 'loading';
                    audio.playFromUrl({
                        audioFile: "https://radio.lo-fi.click/stream",
                        loop: false,
                    }).then(()=>{
                        state = 'playing';
                    });
                } else if(state === 'loading') {
                    return;
                } else if (state === 'playing') {
                    state = 'muted';
                    audio.volume = 0;
                } else if (state === 'muted') {
                    state = 'playing';
                    audio.volume = 1;
                }
            }}></button>
            <flexboxLayout marginTop="20dpi" marginBottom="20dpi" flexDirection="row">
                <button text="🎲" width="50dpi" class="btn" on:tap={updateGif} marginRight="20dpi"></button>
                <button text="About" class="btn" on:tap={()=>{
                    Dialogs.alert({
                        title: "Welcome to lo-fi click!",
                        message: "Lo-Fi.click is a 24/7 online lo-fi radio. \n\nContact: support@lo-fi.click",
                        theme: 16974545,
                        okButtonText: "OK",
                    })
                }} marginRight="30dpi"></button>
            </flexboxLayout>
            <label text="Listeners: {current.listeners}" />
        {:else}
            <label text="Loading..." fontSize="20" />
        {/if}
      </flexboxLayout>
    </flexboxLayout>
  </absoluteLayout>
  
</page>

<style>

  .btn {
    border-radius: 20%;
    background-color: #fbf4e6;
    color: black;
    border-width: 3dpi;
    border-color: black;
    box-shadow: 5dpi 5dpi 0 0 black;
  }

  .player {
      padding: 20dpi;
      border-width: 3dpi;
      border-color: black;
      box-shadow: 5dpi 5dpi 0 0 black;
  }
</style>
