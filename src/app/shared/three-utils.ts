// Модуль для оптимизированных импортов Three.js
// Импортируем только нужные компоненты для лучшего tree-shaking

// Основные компоненты
export { 
  Scene, 
  PerspectiveCamera, 
  WebGLRenderer,
  Group,
  Mesh,
  Object3D,
  Material,
  Color 
} from 'three';

// Геометрии
export {
  BufferGeometry,
  SphereGeometry,
  BoxGeometry,
  BufferAttribute
} from 'three';

// Материалы
export {
  LineBasicMaterial,
  MeshBasicMaterial,
  PointsMaterial
} from 'three';

// Источники света
export {
  AmbientLight,
  PointLight
} from 'three';

// Математические объекты
export {
  Vector3,
  Matrix4
} from 'three';

// Примитивы и линии
export {
  Line,
  LineSegments,
  Points
} from 'three';

// Константы и фильтры для текстур
export { LinearFilter } from 'three';
