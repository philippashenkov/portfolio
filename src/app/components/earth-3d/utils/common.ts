import { Vector3, PlaneGeometry, Mesh, MeshBasicMaterial, Group, DoubleSide, Texture, CatmullRomCurve3, TubeGeometry } from 'three';

export interface punctuation {
  circleColor: number;
  lightColumn: {
    startColor: number;
    endColor: number;
  };
}

/**
 * 经纬度坐标转球面坐标  
 */
export const lon2xyz = (R: number, longitude: number, latitude: number): Vector3 => {
  let lon = longitude * Math.PI / 180;
  const lat = latitude * Math.PI / 180;
  lon = -lon;

  const x = R * Math.cos(lat) * Math.cos(lon);
  const y = R * Math.sin(lat);
  const z = R * Math.cos(lat) * Math.sin(lon);
  
  return new Vector3(x, y, z);
}

// 创建波动光圈
export const createWaveMesh = (options: { radius: number, lon: number, lat: number, textures: Record<string, Texture> }) => {
  const geometry = new PlaneGeometry(1, 1);
  const texture = options.textures['aperture'];

  const material = new MeshBasicMaterial({
    color: 0xe99f68,
    map: texture,
    transparent: true,
    opacity: 1.0,
    depthWrite: false,
  });
  
  const mesh = new Mesh(geometry, material);
  const coord = lon2xyz(options.radius * 1.001, options.lon, options.lat);
  const size = options.radius * 0.12;
  mesh.scale.set(size, size, size);
  mesh.userData['size'] = size;
  mesh.userData['scale'] = Math.random() * 1.0;
  mesh.position.set(coord.x, coord.y, coord.z);
  
  const coordVec3 = new Vector3(coord.x, coord.y, coord.z).normalize();
  const meshNormal = new Vector3(0, 0, 1);
  mesh.quaternion.setFromUnitVectors(meshNormal, coordVec3);
  
  return mesh;
}

// 创建光柱
export const createLightPillar = (options: { 
  radius: number, 
  lon: number, 
  lat: number, 
  index: number, 
  textures: Record<string, Texture>, 
  punctuation: punctuation 
}) => {
  const height = options.radius * 0.3;
  const geometry = new PlaneGeometry(options.radius * 0.05, height);
  geometry.rotateX(Math.PI / 2);
  geometry.translate(0, 0, height / 2);
  
  const material = new MeshBasicMaterial({
    map: options.textures['light_column'],
    color: options.index == 0
      ? options.punctuation.lightColumn.startColor
      : options.punctuation.lightColumn.endColor,
    transparent: true,
    side: DoubleSide,
    depthWrite: false,
  });
  
  const mesh = new Mesh(geometry, material);
  const group = new Group();
  group.add(mesh, mesh.clone().rotateZ(Math.PI / 2));
  
  const SphereCoord = lon2xyz(options.radius, options.lon, options.lat);
  group.position.set(SphereCoord.x, SphereCoord.y, SphereCoord.z);
  
  const coordVec3 = new Vector3(SphereCoord.x, SphereCoord.y, SphereCoord.z).normalize();
  const meshNormal = new Vector3(0, 0, 1);
  group.quaternion.setFromUnitVectors(meshNormal, coordVec3);
  
  return group;
}

// 光柱底座矩形平面
export const createPointMesh = (options: {
  radius: number, 
  lon: number,
  lat: number, 
  material: MeshBasicMaterial
}) => {
  const geometry = new PlaneGeometry(1, 1);
  const mesh = new Mesh(geometry, options.material);
  const coord = lon2xyz(options.radius * 1.001, options.lon, options.lat);
  const size = options.radius * 0.05;
  mesh.scale.set(size, size, size);

  mesh.position.set(coord.x, coord.y, coord.z);
  const coordVec3 = new Vector3(coord.x, coord.y, coord.z).normalize();
  const meshNormal = new Vector3(0, 0, 1);
  mesh.quaternion.setFromUnitVectors(meshNormal, coordVec3);
  
  return mesh;
}

// 获取圆形点
export const getCirclePoints = (option: { radius?: number, number?: number, closed?: boolean }) => {
  const list = [];
  for (let j = 0; j < 2 * Math.PI - 0.1; j += (2 * Math.PI) / (option.number || 100)) {
    list.push([
      parseFloat((Math.cos(j) * (option.radius || 10)).toFixed(2)),
      0,
      parseFloat((Math.sin(j) * (option.radius || 10)).toFixed(2)),
    ]);
  }
  if (option.closed) list.push(list[0]);
  return list;
}

// 创建动态线
export const createAnimateLine = (option: { 
  pointList: number[][], 
  material: any, 
  number?: number, 
  radius?: number,
  radialSegments?: number 
}) => {
  const l: Vector3[] = [];
  option.pointList.forEach((e) =>
    l.push(new Vector3(e[0], e[1], e[2]))
  );
  const curve = new CatmullRomCurve3(l);

  const tubeGeometry = new TubeGeometry(
    curve,
    option.number || 50,
    option.radius || 1,
    option.radialSegments
  );
  
  return new Mesh(tubeGeometry, option.material);
}
