# prepare_embeddings.py
import os
import numpy as np
from PIL import Image
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input

IMAGE_DIR = "images"
OUT_EMB = "embeddings.npy"
OUT_FILES = "filenames.npy"
IMG_SIZE = (224, 224)

def load_and_preprocess(img_path):
    img = Image.open(img_path).convert("RGB").resize(IMG_SIZE)
    arr = np.array(img)
    arr = np.expand_dims(arr, axis=0).astype("float32")
    arr = preprocess_input(arr)
    return arr

def main():
    base = MobileNetV2(
        weights="imagenet",
        include_top=False,
        pooling="avg",
        input_shape=(224, 224, 3)
    )

    filenames = []
    embeddings = []

    for fname in sorted(os.listdir(IMAGE_DIR)):
        if fname.lower().endswith((".jpg", ".jpeg", ".png")):
            path = os.path.join(IMAGE_DIR, fname)
            print("Processing:", fname)
            
            try:
                arr = load_and_preprocess(path)
                feat = base.predict(arr)  # (1, 1280)
                feat = feat.flatten()
                feat = feat / (np.linalg.norm(feat) + 1e-10)
                embeddings.append(feat)
                filenames.append(fname)

            except Exception as e:
                print("Error processing", fname, ":", e)

    embeddings = np.vstack(embeddings)
    np.save(OUT_EMB, embeddings)
    np.save(OUT_FILES, np.array(filenames))

    print("Saved embeddings and filenames!")

if __name__ == "__main__":
    main()
