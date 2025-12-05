# 📸 Image Similarity Search – Minimal MVP Prototype

This project demonstrates a lightweight prototype of a **“search by clicking an image”** feature, similar to what you might see in a modern gallery app.  
The core idea is simple:  

> You click on an image → the system finds visually similar images from your gallery.

This repository contains a clean, minimal MVP implementation that showcases the main concept without extra complexity. It uses a **pre-trained deep-learning model** (MobileNetV2) to extract visual embeddings, stores them, and performs similarity search using cosine distance.

---

## 🚀 Features

- 📂 **Local image gallery** — place your sample images in the `images/` folder.  
- 🧠 **Automatic feature extraction** using MobileNetV2 (pretrained on ImageNet).  
- 🔍 **Similarity search** using cosine distance + Nearest Neighbors.  
- 🌐 **Simple web interface** (Flask + HTML + JS).  
- 🖱️ Click any image → instantly see visually related images.  
- 💡 Fully offline; runs locally in VS Code or any Python environment.  

---

## 🛠️ Tech Stack

- **Python 3.9+**  
- **TensorFlow / MobileNetV2** (for embeddings)  
- **scikit-learn** (for nearest neighbor search)  
- **Flask** (lightweight web server)  
- **HTML / JS / CSS** (front-end)  

This setup is intentionally minimal to keep the prototype clean and focused.

---

## 📁 Project Structure

