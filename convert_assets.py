import os
import subprocess
import glob
import re

# Directorio de trabajo
root_dir = r"c:\Users\Alejandro\Documents\SAMUEL\LANDING PAGE INNOVANDO"
os.chdir(root_dir)

# Extensiones a buscar
img_exts = ['.png', '.jpg', '.jpeg', '.PNG', '.JPG', '.JPEG']
vid_exts = ['.mp4', '.MP4']

print("=== INICIANDO CONVERSIÓN DE ASSETS ===")

# 1. Convertir imágenes a WebP
print("\n--- Convirtiendo imágenes a WebP ---")
for ext in img_exts:
    for file_path in glob.glob(f"**/*{ext}", recursive=True):
        if "node_modules" in file_path or ".git" in file_path:
            continue
            
        webp_path = os.path.splitext(file_path)[0] + ".webp"
        
        # Evitar reconvertir si ya existe y no es el original modificado
        if not os.path.exists(webp_path):
            print(f"Convirtiendo: {file_path} -> {webp_path}")
            # Usar magick para la compresión a webp
            try:
                subprocess.run(["magick", file_path, "-quality", "80", webp_path], check=True)
            except Exception as e:
                print(f"Error al convertir {file_path}: {e}")

# 2. Convertir videos a WebM
print("\n--- Convirtiendo videos a WebM ---")
for ext in vid_exts:
    for file_path in glob.glob(f"**/*{ext}", recursive=True):
        if "node_modules" in file_path or ".git" in file_path:
            continue
            
        webm_path = os.path.splitext(file_path)[0] + ".webm"
        
        if not os.path.exists(webm_path):
            print(f"Convirtiendo: {file_path} -> {webm_path}")
            # Usar ffmpeg.exe (descargado localmente) para convertir a webm (VP9)
            # vcodec libvpx-vp9, crf 30, b:v 0 es una buena configuración para compresión alta
            try:
                subprocess.run([
                    r".\ffmpeg.exe", "-i", file_path, 
                    "-c:v", "libvpx-vp9", "-crf", "30", "-b:v", "0", 
                    "-c:a", "libopus", 
                    webm_path
                ], check=True)
            except Exception as e:
                print(f"Error al convertir {file_path}: {e}")

# 3. Actualizar HTMLs
print("\n--- Actualizando archivos HTML ---")
html_files = glob.glob("**/*.html", recursive=True)

for html_file in html_files:
    if "node_modules" in html_file or ".git" in html_file:
        continue
        
    print(f"Procesando: {html_file}")
    with open(html_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_content = content
    
    # Reemplazar extensiones de imágenes
    content = re.sub(r'(\w+)\.(png|jpg|jpeg|PNG|JPG|JPEG)', r'\1.webp', content)
    
    # Reemplazar extensiones de videos (específicamente en sources y tags video)
    content = re.sub(r'(\w+)\.(mp4|MP4)', r'\1.webm', content)
    content = content.replace('type="video/mp4"', 'type="video/webm"')
    
    if content != original_content:
        with open(html_file, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"  Actualizado: {html_file}")

print("\n=== CONVERSIÓN Y ACTUALIZACIÓN COMPLETADA ===")
