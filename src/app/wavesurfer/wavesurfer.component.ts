import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';

import WaveSurfer from 'wavesurfer.js';
import RegionsPlugin from 'wavesurfer.js/dist/plugins/regions.esm.js'

@Component({
  selector: 'app-wavesurfer',
  templateUrl: './wavesurfer.component.html',
  styleUrls: ['./wavesurfer.component.scss']
})
export class WavesurferComponent implements AfterViewInit {

// Asegúrate de que 'currentTime' está definido así

  @ViewChild('waveform', { static: false }) waveformEl: ElementRef<any>;
  private waveform: WaveSurfer;
  public isPlaying: boolean;
  public currentTime: number = 0; 
  public start: number = 5;
  public end: number = 10;

  labelCount = 0;



  addLabel() {
    const labelList = document.querySelector('.label.label-1');
    const newLabelItem = document.createElement('li');
    this.labelCount++;
    newLabelItem.textContent = `Etiqueta ${this.labelCount}: Inicio: ${this.start}, Fin: ${this.end}, Letra: E`;
    labelList.appendChild(newLabelItem);
  }
  ngAfterViewInit(): void {

    this.isPlaying = false;
    
    //crear instancia de wavesurfer
    this.waveform = WaveSurfer.create({
      container: this.waveformEl.nativeElement,
      url: './assets/audio/audio.mp3',
      waveColor: '#4F4A85',
      progressColor: '#383351',
      barWidth: 2,
      barRadius: 2,
      plugins: [
        RegionsPlugin.create()
      ]
      
    });
    this.events();
    

    const wsRegions = this.waveform.registerPlugin(RegionsPlugin.create())
    const random = (min, max) => Math.random() * (max - min) + min
    const randomColor = () => `rgba(${random(0, 255)}, ${random(0, 255)}, ${random(0, 255)}, 0.5)`
    this.waveform.on('decode', () => {
      // Regions
      wsRegions.addRegion({
        start: 0.3,
        end: 0.4,
        content: 'test',
        color: randomColor(),
        drag: false,
        resize: true,
      })})
        // Actualiza el tiempo actual cada vez que el audio se reproduce
  // Registra el evento 'audioprocess' aquí, fuera del evento 'play'
  wsRegions.enableDragSelection({
    color: 'rgba(255, 0, 0, 0.1)',
  })
  
  wsRegions.on('region-updated', (region) => {
    console.log('Updated region', region)
  })
  let loop = true
  // Toggle looping with a checkbox
  //document.querySelector('input[type="checkbox"]').onclick = (e) => {
    //loop = e.target.checked
  //}
  {
    let activeRegion = null
    wsRegions.on('region-in', (region) => {
      console.log('region-in', region)
      activeRegion = region
    })
    wsRegions.on('region-out', (region) => {
      console.log('region-out', region)
      if (activeRegion === region) {
        if (loop) {
          region.play()
        } else {
          activeRegion = null
        }
      }
    })
    wsRegions.on('region-clicked', (region, e) => {
      e.stopPropagation() // prevent triggering a click on the waveform
      activeRegion = region
      region.play()
      region.setOptions({ color: randomColor() })
    })
    // Reset the active region when the user clicks anywhere in the waveform
    this.waveform.on('interaction', () => {
      activeRegion = null
    })
  }
}
/*// Loop a region on click
let loop = true
// Toggle looping with a checkbox
document.querySelector('input[type="checkbox"]').onclick = (e) => {
  loop = e.target.checked
}

{
  let activeRegion = null
  wsRegions.on('region-in', (region) => {
    console.log('region-in', region)
    activeRegion = region
  })
  wsRegions.on('region-out', (region) => {
    console.log('region-out', region)
    if (activeRegion === region) {
      if (loop) {
        region.play()
      } else {
        activeRegion = null
      }
    }
  })
  */
events(){
  this.waveform.on('play', () => {
    this.isPlaying = true;
  });

  this.waveform.on('pause', () => {
    this.isPlaying = false;
  });
  this.waveform.on('ready', () => {
    this.zoomIn();
  });
}
zoomIn() {
  console.log(this.waveform)
  console.log("Zoom In ejecutado"); // Verificación en consola
  this.zoomLevel += 0.1;
  console.log("Zoom level:", this.zoomLevel); // Verificación en consola
  this.waveform.zoom(this.zoomLevel);
}

zoomOut() {
  if (this.zoomLevel - 20 > 0) {
    this.zoomLevel -= 20;
  } else {
    this.zoomLevel = 0;
  }
  this.waveform.zoom(this.zoomLevel);
}



  playAudio(){
    
    this.waveform.play();
  }

  pauseAudio(){
    this.waveform.pause();
  }

  stopAudio(){
    this.waveform.stop();
  }
  tracks = [{}]; // Inicialmente, la lista tiene un track vacío

  addTrack() {
    this.tracks.push({}); // Agrega un nuevo track vacío a la lista
  }

removeTrack(index: number) {
  if (this.tracks.length === 1) {
    window.alert('No se puede eliminar el último track. Debe existir al menos un track activo.');
  } else {
    this.tracks.splice(index, 1); // Elimina el track en el índice especificado
  }
}
zoomLevel: number = 0; // Añade una propiedad para mantener el nivel de zoom



} 
