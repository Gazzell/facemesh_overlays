import * as dat from 'dat.gui';
export class DebugGUI {
  _gui;
  _adapter;
  _data = {
    stabilize: true
  };
  
  constructor({ adapter }) {
    this._adapter = adapter;
    this._gui = new dat.GUI();
    
    this._addGeneral();
  }

  _addGeneral() {
    this._gui.add(this._adapter, 'stabilizePoints').name('Stabilize mesh');
  }
}