import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { moveItemInArray } from "@angular/cdk/drag-drop";
import { SharedService } from "../shared.service";
import * as $ from 'jquery';

@Component({
  selector: 'app-futebol',
  templateUrl: './futebol.component.html',
  styleUrls: ['./futebol.component.css']
})
export class FutebolComponent implements OnInit{
  position = "Posição do Jogador Selecionado";

  arrayJogadores: any[] = [];

  jogadores = [
    {"JogadorId": 1, "JogadorNome": 'Alisson',"JogadorForca": 152, "JogadorX": 0, "JogadorY": 0},
    {"JogadorId": 2, "JogadorNome": 'Danilo', "JogadorForca": 251,"JogadorX": 0, "JogadorY": 0},
    {"JogadorId": 3, "JogadorNome": 'Thiago Silva', "JogadorForca": 230,"JogadorX": 0, "JogadorY": 0},
    {"JogadorId": 4, "JogadorNome": 'Marquinhos', "JogadorForca": 247,"JogadorX": 0, "JogadorY": 0},
    {"JogadorId": 5, "JogadorNome": 'Casemiro', "JogadorForca": 315,"JogadorX": 0, "JogadorY": 0},
    {"JogadorId": 6, "JogadorNome": 'Alexandro', "JogadorForca": 231,"JogadorX": 0, "JogadorY": 0},
    {"JogadorId": 7, "JogadorNome": 'Raphinha', "JogadorForca": 452,"JogadorX": 0, "JogadorY": 0},
    {"JogadorId": 8, "JogadorNome": 'Paquetá', "JogadorForca": 102,"JogadorX": 0, "JogadorY": 0},
    {"JogadorId": 9, "JogadorNome": 'Richarlison', "JogadorForca": 214,"JogadorX": 0, "JogadorY": 0},
    {"JogadorId": 10, "JogadorNome": 'Neymar', "JogadorForca": 354,"JogadorX": 0, "JogadorY": 0},
    {"JogadorId": 11, "JogadorNome": 'Vini Jr.', "JogadorForca": 374,"JogadorX": 0, "JogadorY": 0},
  ];

  keys = ['JogadorNome', 'JogadorForca', 'JogadorX', 'JogadorY'];

  title = 'mouse-hover';
  showImage: boolean;
  constructor(private service: SharedService){
    this.showImage = false;
  }

  ngOnInit(): void { }

  /*
    Função responsável por realizar uma requisição POST
    (botão de enviar)
  */
  Submit() {
    this.service.addJogador((this.arrayJogadores)).subscribe(res => {
      let resultado = res.toString();
      document.getElementById("resultDiv").innerHTML = resultado;
      this.desenharAresta(resultado);
    });
  }

  desenharAresta(resultado: string) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg' ,'svg');
    svg.setAttribute('width', '1470');
    svg.setAttribute('height', '800');
    const resultadoJogadores = Array.from(document.getElementsByTagName('a'));

    const arr = [];
    for (const i in resultadoJogadores){
      arr.push($(resultadoJogadores[i]).text());
    }

    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    const linearGradient = document.createElementNS("http://www.w3.org/2000/svg", 'linearGradient');
    linearGradient.setAttribute('id', 'gradient');
    linearGradient.setAttribute('x1', '0%');
    linearGradient.setAttribute('y1', '100%');
    linearGradient.setAttribute('x2', '0%');
    linearGradient.setAttribute('y2', '0%');

    const stop1 = document.createElementNS("http://www.w3.org/2000/svg", 'stop');
    const stop2 = document.createElementNS("http://www.w3.org/2000/svg", 'stop');
    stop1.setAttribute('offset', '0%');
    stop1.setAttribute('stop-color', '#00b824');
    stop2.setAttribute('offset', '100%');
    stop2.setAttribute('stop-color', '#007940');
    linearGradient.appendChild(stop1);
    linearGradient.appendChild(stop2);
    defs.appendChild(linearGradient);
    svg.appendChild(defs);

    for (let i = 0; i < arr.length; i++) {
      const line = document.createElementNS('http://www.w3.org/2000/svg' , 'line');
      for (let j = 0; j < 11; j++) {
        if (arr[i] === this.arrayJogadores[j]['JogadorNome']) {
          line.setAttribute('x1', this.arrayJogadores[j]['JogadorX']); // X inicial
          line.setAttribute('y1', this.arrayJogadores[j]['JogadorY']); // Y Inicial
          document.getElementById('jogador'+ this.arrayJogadores[j]['JogadorId']).classList.remove('type2');
          document.getElementById('jogador'+ this.arrayJogadores[j]['JogadorId']).classList.add('type3');
        }
      }

      for (let j = 0; j < 11; j++) {
        if (arr[i + 1] === this.arrayJogadores[j]['JogadorNome']) {
          line.setAttribute('x2', this.arrayJogadores[j]['JogadorX']); // X Final
          line.setAttribute('y2', this.arrayJogadores[j]['JogadorY']); // Y Final
          document.getElementById('jogador'+ this.arrayJogadores[j]['JogadorId']).classList.remove('type2');
          document.getElementById('jogador'+ this.arrayJogadores[j]['JogadorId']).classList.add('type3');
          line.setAttribute('stroke', 'url(#gradient)');
          line.setAttribute('stroke-width', '10');
          line.setAttribute('style', 'filter: drop-shadow(0px 0px 4px rgb(80, 141, 44)');
          svg.appendChild(line);
          document.getElementById('drop-list').appendChild(svg);
        }
      }
    }
  }

  @ViewChild('dropZone', {read: ElementRef, static: true})
  dropZone: ElementRef;
  _pointerPosition;

  /*
    Função responsável por obter os valores X e Y.
  */
  atualizarPosicao(data: any, x: number, y: number) {
    for (let i in this.jogadores) {
      if (this.jogadores[i] === data) {
        this.jogadores[i]["JogadorX"] = +x;
        this.jogadores[i]["JogadorY"] = +y;
      }
    }
  }

  /*
    Função responsável por realizar o movimento de um jogador(vértice)
    e chamar a função atualizarPosicao para obter os valores de X e Y.
  */
  moved(event) {
    this._pointerPosition = event.pointerPosition;
    this.position = `Posição X: ${this._pointerPosition.x} - Y: ${this._pointerPosition.y}`;
    this.atualizarPosicao(event.source.data, parseInt(this._pointerPosition.x), parseInt(this._pointerPosition.y));
  }

  /*
    Responsável por persistir os itens dentro do campo de futebol.
    Sempre que um jogador é colocado no campo, esta função coloca o jogador no array:
    arrayJogadores[].
  */
  itemDropped(event) {
    if (event.previousContainer === event.container) {
      moveItemInArray(this.arrayJogadores, event.previousIndex, event.currentIndex);
    } else {
      event.item.data.top =
        this._pointerPosition.y -
        this.dropZone.nativeElement.getBoundingClientRect().top +
        'px';
      event.item.data.left =
        this._pointerPosition.x -
        this.dropZone.nativeElement.getBoundingClientRect().left +
        'px';
      this.addField({ ...event.item.data }, event.currentIndex);
      this.jogadores = this.jogadores.filter(jogador => jogador.JogadorId != event.item.data.JogadorId)
    }
  }

  /*
    Função complementar para adicionar os jogadores colocados no campo em um array.
  */
  addField(fieldType: object, index: number) {
    this.arrayJogadores.splice(index, 0, fieldType);
  }

  /*
    Função responsável por mostrar as informações dos jogadores para o usuário de acordo com o mouse.
  */
  jogadorSelecionado = null;
  MostrarJogador(item){
    this.jogadorSelecionado = item;
  }
}

