"""
Script para eliminar fondos solidos de logos y guardarlos como PNG transparentes.
Usa un algoritmo de flood-fill desde las esquinas para detectar y eliminar el fondo.
"""
from PIL import Image
import os
from collections import deque

LOGOS_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "assets", "logos")

# Archivos a procesar: (nombre_entrada, nombre_salida)
TO_PROCESS = [
    ("cafe.jpg",        "cafe.png"),
    ("cm.jpg",          "cm.png"),
    ("bancoplaza.webp", "bancoplaza.png"),
    ("bimbo.webp",      "bimbo.png"),
    ("simon.png",       "simon.png"),
    ("epa.png",         "epa.png"),
]

def color_distance(c1, c2):
    """Distancia euclidiana entre dos colores RGB."""
    return ((c1[0]-c2[0])**2 + (c1[1]-c2[1])**2 + (c1[2]-c2[2])**2) ** 0.5

def remove_bg_floodfill(img, threshold=30):
    """
    Elimina el fondo usando flood-fill desde las 4 esquinas.
    Convierte la imagen a RGBA y hace transparentes los pixeles del fondo.
    """
    img = img.convert("RGBA")
    data = img.load()
    w, h = img.size

    # Tomar el color de fondo desde las 4 esquinas
    corner_colors = [
        data[0, 0][:3],
        data[w-1, 0][:3],
        data[0, h-1][:3],
        data[w-1, h-1][:3],
    ]

    # Usar el color mas claro de las esquinas como color de fondo
    bg_color = max(corner_colors, key=lambda c: c[0]+c[1]+c[2])

    # Flood-fill BFS desde las 4 esquinas
    visited = set()
    queue = deque()
    seeds = [(0, 0), (w-1, 0), (0, h-1), (w-1, h-1)]

    for sx, sy in seeds:
        if (sx, sy) not in visited:
            queue.append((sx, sy))
            visited.add((sx, sy))

    while queue:
        x, y = queue.popleft()
        r, g, b, a = data[x, y]
        if color_distance((r, g, b), bg_color) <= threshold:
            data[x, y] = (r, g, b, 0)  # Hacer transparente
            for nx, ny in [(x+1, y), (x-1, y), (x, y+1), (x, y-1)]:
                if 0 <= nx < w and 0 <= ny < h and (nx, ny) not in visited:
                    visited.add((nx, ny))
                    queue.append((nx, ny))

    return img

def process_logo(src_name, dst_name, threshold=30):
    src_path = os.path.join(LOGOS_DIR, src_name)
    dst_path = os.path.join(LOGOS_DIR, dst_name)

    if not os.path.exists(src_path):
        print(f"  No encontrado: {src_path}")
        return False

    print(f"  Procesando {src_name} -> {dst_name} ...", end=" ", flush=True)
    img = Image.open(src_path)
    result = remove_bg_floodfill(img, threshold=threshold)
    result.save(dst_path, "PNG")
    print("OK")
    return True

if __name__ == "__main__":
    print(f"\nEliminando fondos en: {LOGOS_DIR}\n")

    # Thresholds personalizados por logo
    custom_thresholds = {
        "epa.png": 40,
        "simon.png": 25,
        "bimbo.webp": 20,
        "bancoplaza.webp": 20,
        "cm.jpg": 15,
        "cafe.jpg": 20,
    }

    ok = 0
    for src, dst in TO_PROCESS:
        t = custom_thresholds.get(src, 30)
        if process_logo(src, dst, threshold=t):
            ok += 1

    print(f"\n{ok}/{len(TO_PROCESS)} logos procesados.\n")
