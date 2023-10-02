import * as dat from 'dat.gui';
export class DebugGUI {
  _gui;
  _adapter;
  _effectsRenderer;
  _data = {
    stabilize: true
  };
  
  constructor({ adapter, effectsRenderer }) {
    this._adapter = adapter;
    this._effectsRenderer = effectsRenderer;
    this._gui = new dat.GUI();
    
    this._addGeneral();
  }

  _addGeneral() {
    this._gui.add(this._adapter, 'stabilizePoints').name('Stabilize mesh');
    this._gui.add(this._effectsRenderer, 'wireframe').name('Wireframe');
  }
}