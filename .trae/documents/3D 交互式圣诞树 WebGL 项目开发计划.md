# 3D 交互式圣诞树 WebGL 项目开发计划

根据您的需求，我制定了以下开发计划，将从零构建这个基于 React、Three.js 和 WebGL 的互动网页应用。

## 1. 项目初始化与配置 (Project Setup)
- **目标**: 搭建基于 Webpack 的开发环境。
- **任务**:
    1.  初始化 `package.json`。
    2.  安装核心依赖: `react`, `three`, `@react-three/fiber`, `@react-three/drei`, `gsap`, `zustand`, `@mediapipe/tasks-vision`。
    3.  安装开发工具: `webpack`, `babel`, `tailwindcss`, `postcss` 及相关 loaders。
    4.  创建配置文件: `webpack.config.js`, `tailwind.config.js`, `.babelrc`。

## 2. 状态管理与工具库 (State & Utils)
- **目标**: 建立数据流和数学辅助函数。
- **任务**:
    1.  创建 `src/store.js`: 使用 Zustand 管理 `phase` (tree/blooming/nebula/collapsing)、手势状态和相机目标。
    2.  创建 `src/utils/geometry.js`: 编写生成圆锥体 (树) 和 环形 (星云) 粒子坐标的算法。

## 3. 3D 场景开发 (3D Scene Development)
- **目标**: 构建沉浸式 3D 环境。
- **任务**:
    1.  `src/components/Scene.jsx`: 设置 Canvas，配置黑色背景、动态星星、灯光系统 (暖/冷光 + 聚光灯) 和后期处理 (Bloom, Vignette)。
    2.  `src/components/ChristmasTree.jsx`:
        -   使用 `instancedMesh` 渲染 5000+ 粒子。
        -   实现 PBR 材质的装饰球和发光星星。
        -   编写 Shader 或 Frame Loop 逻辑实现鼠标斥力效果。
        -   使用 GSAP 实现从 Tree 到 Nebula 的爆炸与重组动画。

## 4. 手势识别与 UI (Hand Tracking & UI)
- **目标**: 实现交互控制和视觉界面。
- **任务**:
    1.  `src/components/HandTracker.jsx`: 集成 MediaPipe，识别 Open Palm (炸开/翻页) 和 Closed Fist (重置)。
    2.  `src/components/UI.jsx`: 使用 Tailwind CSS 实现玻璃拟态界面、标题、状态指示器和音乐播放器 UI。

## 5. 整合与资源 (Integration)
- **目标**: 组装应用并运行。
- **任务**:
    1.  编写入口文件 `src/index.js` 和 `src/App.jsx`。
    2.  配置 HTML 模板和静态资源路径。
    3.  调试动画过渡和性能优化。

准备好后，请确认此计划，我将开始编写代码。