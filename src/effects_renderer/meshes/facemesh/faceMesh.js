import { Mesh, MeshStandardMaterial, FrontSide, Group } from 'three';
import { FaceMeshFaceGeometry } from './facemeshGeometry';

const fakeMaterial = new MeshStandardMaterial({
  color: 0xffffff,
  roughness: 0.7,
  metalness: 0.0,
  side: FrontSide,
  wireframe: true,
});

export class FaceMesh extends Group {
  constructor({ source: { width, height }, zIndex = 0, faces, baseReferenceData, name, isMultimaterial }) { 
    super(...arguments);
    this._faceGeometry = new FaceMeshFaceGeometry({ faces, baseReferenceData });
    this._faceGeometry.setSize(width, height);
    this.name = name;
    this.translateZ(zIndex);

    this._createMeshes(isMultimaterial);
  }

  _createMeshes(isMultimaterial = false) {
      this._baseMesh = new Mesh(this._faceGeometry, fakeMaterial);
      this._baseMesh.name = 'baseMesh';

      this.add(this._baseMesh);

      if (isMultimaterial) {
        this._multiMaterialMesh = new Mesh(this._faceGeometry, fakeMaterial);
        this._multiMaterialMesh.name = 'multiMaterialMesh';
        this.add(this._multiMaterialMesh);
      }
  }

  dispose() {
    this._faceGeometry?.dispose();
    this._faceGeometry = null;
    this._baseMesh = null;
    
    if(this._multiMaterialMesh) {
      this._multiMaterialMesh = null;
    }
    
    super.dispose();
  }

  set material(material) {
    if (!this._multiMaterialMesh) {
      this._baseMesh.material = material;
      return;
    }

    const baseMaterial = material.clone();
    baseMaterial.colorWrite = false;
    baseMaterial.name = 'baseMaterial';

    this._baseMesh.material = baseMaterial;
    this._multiMaterialMesh.material = material;
    this._multiMaterialMesh.material.name = 'material';
  }

  update(face) {
    this._faceGeometry?.update(face);
  }
}
