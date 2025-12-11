# 🎄 Interactive 3D Christmas Tree / 3D 互动圣诞树

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-19-blue.svg)](https://reactjs.org/)
[![Three.js](https://img.shields.io/badge/Three.js-r160+-black.svg)](https://threejs.org/)

A magical, interactive 3D Christmas Tree experience running in your browser. Features gesture control, a 3D photo gallery, and mesmerizing particle animations.
一个运行在浏览器中的魔幻 3D 互动圣诞树体验。支持手势控制、3D 照片墙展示以及迷人的粒子动画效果。

---

## ✨ Features / 功能特性

*   **🎨 3D Particle Tree**: A beautiful tree composed of thousands of instanced particles.
    *   **3D 粒子树**：由数千个实例化粒子组成的精美圣诞树。
*   **🖐️ Gesture Control**: Use your webcam to interact! "Open Palm" to bloom the tree into a nebula, "Closed Fist" to restore it.
    *   **手势控制**：使用摄像头进行互动！"张开手掌"让树绽放成星云，"握紧拳头"将其还原。
*   **🖼️ Interactive Photo Gallery**: Click on the ornaments to view photos in a stunning 3D overlay.
    *   **互动照片墙**：点击树上的挂件，以精美的 3D 叠加层查看照片。
*   **✨ Fairy Lights & Star**: Twinkling fairy lights and a glowing top star.
    *   **梦幻彩灯与星星**：闪烁的彩灯和发光的顶部星星。
*   **🖱️ Mouse Interaction**: Particles react to your mouse movement (when in tree mode).
    *   **鼠标互动**：粒子会随鼠标移动产生互动（在树模式下）。

## 🛠️ Tech Stack / 技术栈

*   **React 19**: UI and component management.
*   **Three.js & React Three Fiber**: High-performance 3D rendering.
*   **GSAP**: Smooth animations and transitions.
*   **MediaPipe**: Real-time hand tracking and gesture recognition.
*   **Zustand**: State management.
*   **Tailwind CSS**: Styling.

## 🚀 Getting Started / 快速开始

### Prerequisites / 前置要求

*   Node.js (v18 or higher)
*   npm or yarn

### Installation / 安装

1.  Clone the repository:
    ```bash
    git clone https://github.com/yuanlehome/ChristmasTree.git
    cd ChristmasTree
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Run the development server:
    ```bash
    npm start
    ```

4.  Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### Build / 构建

To build the project for production:

```bash
npm run build
```

The output will be in the `dist` folder.

## 🎮 Controls / 操作指南

| Interaction | Action |
| :--- | :--- |
| **Left Click** | Rotate the scene / Click photos |
| **Scroll** | Zoom in/out |
| **Webcam Gesture** | **Open Palm**: Explode to Nebula <br> **Closed Fist**: Form Tree |

| 交互 | 动作 |
| :--- | :--- |
| **左键点击** | 旋转场景 / 点击查看照片 |
| **滚轮** | 缩放视图 |
| **摄像头手势** | **张开手掌**: 炸裂成星云 <br> **握紧拳头**: 聚合成树 |

## 🤝 Contributing / 贡献

Contributions are welcome! Please feel free to submit a Pull Request.
欢迎提交 PR 贡献代码！

## 📄 License / 许可

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
本项目采用 MIT 许可证 - 详情请见 [LICENSE](LICENSE) 文件。
