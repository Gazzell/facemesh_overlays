import { BufferGeometry, BufferAttribute, Vector3, Triangle, Matrix4 } from 'three';

export class FaceMeshFaceGeometry extends BufferGeometry {
  constructor({ faces = [], useVideoTexture = false, normalizeCoords = false, baseReferenceData } = {}) {
    super();

    this.baseReferenceData = baseReferenceData;

    this.pointsCount = baseReferenceData.points.length;

    this.useVideoTexture = useVideoTexture || false;
    this.normalizeCoords = normalizeCoords || false;
    this.flipped = false;
    this.positions = new Float32Array(this.pointsCount * 3);
    this.uvs = new Float32Array(this.pointsCount * 2);
    this.setAttribute('position', new BufferAttribute(this.positions, 3));
    this.setAttribute('uv', new BufferAttribute(this.uvs, 2));
    this.calculateUvs();
    this.setIndex(faces);
    this.computeVertexNormals();
    this.applyMatrix4(new Matrix4().makeScale(10, 10, 10));
    this.p0 = new Vector3();
    this.p1 = new Vector3();
    this.p2 = new Vector3();
    this.triangle = new Triangle();
  }

  calculateUvs() {
    const { points: baseReferencePoints, imageSize: baseReferenceImageSize } = this.baseReferenceData;
    
    for (let j = 0; j < baseReferencePoints.length; j++) {
      this.uvs[j * 2] = baseReferencePoints[j].x / baseReferenceImageSize.width;
      this.uvs[j * 2 + 1] =1 - baseReferencePoints[j].y / baseReferenceImageSize.height;
    }
    this.getAttribute('uv').needsUpdate = true;
  }

  setSize(w, h) {
    this.w = w;
    this.h = h;
  }

  update(face, cameraFlipped) {
    let ptr = 0;
    face.forEach(({ x, y, z }) => {
      this.positions[ptr] = cameraFlipped ? x + 0.5 * this.w : x - 0.5 * this.w;
      this.positions[ptr + 1] = this.h - y - 0.5 * this.h;
      this.positions[ptr + 2] = -z;
      ptr += 3;
    });

    this.attributes.position.needsUpdate = true;
    this.computeVertexNormals();
  }

  track(id0, id1, id2) {
    const points = this.positions;
    this.p0.set(points[id0 * 3], points[id0 * 3 + 1], points[id0 * 3 + 2]);
    this.p1.set(points[id1 * 3], points[id1 * 3 + 1], points[id1 * 3 + 2]);
    this.p2.set(points[id2 * 3], points[id2 * 3 + 1], points[id2 * 3 + 2]);
    this.triangle.set(this.p0, this.p1, this.p2);
    const center = new Vector3();
    this.triangle.getMidpoint(center);
    const normal = new Vector3();
    this.triangle.getNormal(normal);
    const matrix = new Matrix4();
    const x = this.p1.clone().sub(this.p2).normalize();
    const y = this.p1.clone().sub(this.p0).normalize();
    const z = new Vector3().crossVectors(x, y);
    const y2 = new Vector3().crossVectors(x, z).normalize();
    const z2 = new Vector3().crossVectors(x, y2).normalize();
    matrix.makeBasis(x, y2, z2);
    return { position: center, normal, rotation: matrix };
  }

  updateFaces({ faces }) {
    this.setIndex(faces);
  }
}
