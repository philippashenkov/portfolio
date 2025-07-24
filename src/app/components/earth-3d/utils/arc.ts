import { 
  ArcCurve, 
  BufferGeometry, 
  BufferAttribute,
  Line, 
  LineBasicMaterial, 
  Points, 
  PointsMaterial, 
  Quaternion, 
  Vector3,
  Group,
  Mesh,
  TubeGeometry,
  CatmullRomCurve3
} from 'three';
import { lon2xyz } from './common';

/**
 * 绘制一条圆弧飞线
 */
function createFlyLine(radius: number, startAngle: number, endAngle: number, color: number) {
  const geometry = new BufferGeometry();
  const arc = new ArcCurve(0, 0, radius, startAngle, endAngle, false);
  const points = arc.getPoints(50);
  geometry.setFromPoints(points);

  const material = new LineBasicMaterial({
    color: color || 0xd18547,
  });
  
  const line = new Line(geometry, material);
  return line;
}

/**
 * 绘制飞线圆弧轨迹
 */
export function flyArc(
  radius: number, 
  lon1: number, 
  lat1: number, 
  lon2: number, 
  lat2: number,
  options: any
) {
  const startSphere = lon2xyz(radius, lon1, lat1);
  const endSphere = lon2xyz(radius, lon2, lat2);
  
  // 计算中点
  const middleV3 = startSphere.clone().add(endSphere).multiplyScalar(0.5);
  
  // 计算圆弧高度
  const height = startSphere.distanceTo(endSphere) * 0.3;
  middleV3.normalize().multiplyScalar(radius + height);
  
  // 创建曲线
  const curve = new CatmullRomCurve3([startSphere, middleV3, endSphere]);
  
  // 创建管道几何体
  const tubeGeometry = new TubeGeometry(curve, 50, 0.2, 8, false);
  
  // 创建飞线材质
  const material = new LineBasicMaterial({
    color: options.color || 0xf3ae76,
    transparent: true,
    opacity: 0.8,
  });
  
  // 创建飞线组
  const group = new Group();
  
  // 基础轨迹线
  const line = new Line(new BufferGeometry().setFromPoints(curve.getPoints(50)), material);
  group.add(line);
  
  // 飞行点
  const flyPointGeometry = new BufferGeometry();
  const flyPointMaterial = new PointsMaterial({
    color: options.flyLineColor || 0xff7714,
    size: 2,
    transparent: true,
  });
  
  const flyPoint = new Points(flyPointGeometry, flyPointMaterial);
  flyPoint.userData = {
    flyLine: {
      rotation: { z: 0 },
      flyEndAngle: Math.PI * 2,
    }
  };
  
  group.add(flyPoint);
  group.userData = { flyLine: flyPoint.userData['flyLine'] };
  
  return group;
}
