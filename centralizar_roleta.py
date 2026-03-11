#!/usr/bin/env python3
"""
═══════════════════════════════════════════════════════════
  CENTRALIZAR IMAGEM DA ROLETA
  
  Este script analisa 04.wheel-european.png,
  encontra o centro real da roda (pelo formato circular),
  e gera uma nova imagem perfeitamente centralizada.
  
  COMO USAR:
  1. Instalar Pillow: pip install Pillow numpy
  2. Colocar este script na RAIZ do projeto (onde está public/)
  3. Rodar: python centralizar_roleta.py
  4. A imagem corrigida será salva em public/assets/roulette/
═══════════════════════════════════════════════════════════
"""

from PIL import Image, ImageFilter
import numpy as np
import os

# ─── Config ───
INPUT_PATH = "public/assets/roulette/04.wheel-european.png"
OUTPUT_PATH = "public/assets/roulette/04.wheel-european.png"  # Sobrescreve
BACKUP_PATH = "public/assets/roulette/04.wheel-european.BACKUP.png"

def find_wheel_center(img_array):
    """
    Encontra o centro da roda usando detecção de bordas circular.
    Analisa os pixels opacos e encontra o centro de massa,
    mas com peso maior nos pixels da borda (anel dourado externo).
    """
    h, w = img_array.shape[:2]
    
    # Converter para grayscale se necessário
    if len(img_array.shape) == 3:
        if img_array.shape[2] == 4:  # RGBA
            # Usar apenas pixels com alpha > 128
            alpha = img_array[:, :, 3]
            gray = np.mean(img_array[:, :, :3], axis=2)
            # Mascarar pixels transparentes
            gray[alpha < 128] = 0
        else:  # RGB
            gray = np.mean(img_array, axis=2)
    else:
        gray = img_array.astype(float)
    
    # Método 1: Centro de massa dos pixels brilhantes
    threshold = 30  # pixels com brilho > 30
    bright_mask = gray > threshold
    
    ys, xs = np.where(bright_mask)
    if len(xs) == 0:
        return w // 2, h // 2
    
    center_mass_x = np.mean(xs)
    center_mass_y = np.mean(ys)
    
    # Método 2: Bounding box dos pixels opacos
    min_x, max_x = np.min(xs), np.max(xs)
    min_y, max_y = np.min(ys), np.max(ys)
    bbox_center_x = (min_x + max_x) / 2
    bbox_center_y = (min_y + max_y) / 2
    
    # Método 3: Detecção circular
    # Procurar o anel dourado externo (pixels mais brilhantes na periferia)
    # Pegar os pixels com brilho > 150 (o anel dourado é bem brilhante)
    gold_mask = gray > 150
    gold_ys, gold_xs = np.where(gold_mask)
    
    if len(gold_xs) > 100:
        gold_center_x = np.mean(gold_xs)
        gold_center_y = np.mean(gold_ys)
    else:
        gold_center_x = center_mass_x
        gold_center_y = center_mass_y
    
    # Método 4: Usando simetria radial
    # Para cada ângulo, encontrar a distância até a borda
    # O centro correto é onde as distâncias são mais simétricas
    best_cx, best_cy = bbox_center_x, bbox_center_y
    best_score = float('inf')
    
    # Testar pontos ao redor do bbox_center
    search_range = 50  # pixels
    step = 5
    
    for test_cx in range(int(bbox_center_x - search_range), int(bbox_center_x + search_range), step):
        for test_cy in range(int(bbox_center_y - search_range), int(bbox_center_y + search_range), step):
            # Calcular distância de cada pixel brilhante ao centro teste
            dists = np.sqrt((gold_xs - test_cx)**2 + (gold_ys - test_cy)**2)
            
            # Para um círculo perfeito, todos os pixels da borda 
            # teriam a mesma distância ao centro
            # Agrupamos por ângulo e vemos a variância do raio
            angles = np.arctan2(gold_ys - test_cy, gold_xs - test_cx)
            angle_bins = np.digitize(angles, np.linspace(-np.pi, np.pi, 36))
            
            # Para cada bin angular, pegar o raio máximo (borda externa)
            max_radii = []
            for b in range(1, 37):
                mask = angle_bins == b
                if np.any(mask):
                    max_radii.append(np.percentile(dists[mask], 95))
            
            if len(max_radii) >= 30:  # Precisamos de cobertura boa
                score = np.std(max_radii)  # Menor variância = mais circular
                if score < best_score:
                    best_score = score
                    best_cx = test_cx
                    best_cy = test_cy
    
    # Refinar com step menor
    coarse_cx, coarse_cy = best_cx, best_cy
    for test_cx in range(int(coarse_cx - step), int(coarse_cx + step + 1)):
        for test_cy in range(int(coarse_cy - step), int(coarse_cy + step + 1)):
            dists = np.sqrt((gold_xs - test_cx)**2 + (gold_ys - test_cy)**2)
            angles = np.arctan2(gold_ys - test_cy, gold_xs - test_cx)
            angle_bins = np.digitize(angles, np.linspace(-np.pi, np.pi, 36))
            max_radii = []
            for b in range(1, 37):
                mask = angle_bins == b
                if np.any(mask):
                    max_radii.append(np.percentile(dists[mask], 95))
            if len(max_radii) >= 30:
                score = np.std(max_radii)
                if score < best_score:
                    best_score = score
                    best_cx = test_cx
                    best_cy = test_cy
    
    print(f"  Centro de massa:     ({center_mass_x:.1f}, {center_mass_y:.1f})")
    print(f"  Centro bbox:         ({bbox_center_x:.1f}, {bbox_center_y:.1f})")
    print(f"  Centro anel dourado: ({gold_center_x:.1f}, {gold_center_y:.1f})")
    print(f"  Centro simétrico:    ({best_cx:.1f}, {best_cy:.1f}) [score: {best_score:.2f}]")
    print(f"  Centro da imagem:    ({w/2:.1f}, {h/2:.1f})")
    
    # Usar o centro simétrico como resultado
    return int(round(best_cx)), int(round(best_cy))


def center_wheel_image(input_path, output_path):
    """
    Abre a imagem, encontra o centro real, e cria nova imagem centralizada.
    """
    print(f"\n{'═'*60}")
    print(f"  CENTRALIZANDO IMAGEM DA ROLETA")
    print(f"{'═'*60}\n")
    
    # Abrir imagem
    img = Image.open(input_path)
    print(f"Imagem: {input_path}")
    print(f"Tamanho: {img.size[0]} x {img.size[1]}")
    print(f"Modo: {img.mode}")
    
    # Converter para RGBA se necessário
    if img.mode != 'RGBA':
        img = img.convert('RGBA')
    
    w, h = img.size
    img_center_x = w // 2
    img_center_y = h // 2
    
    # Encontrar centro real
    print(f"\nAnalisando centro da roda...")
    arr = np.array(img)
    real_cx, real_cy = find_wheel_center(arr)
    
    # Calcular offset
    offset_x = real_cx - img_center_x
    offset_y = real_cy - img_center_y
    print(f"\n  OFFSET: X={offset_x}px, Y={offset_y}px")
    print(f"  (Centro real está {abs(offset_x)}px {'à direita' if offset_x > 0 else 'à esquerda'} e {abs(offset_y)}px {'abaixo' if offset_y > 0 else 'acima'} do centro da imagem)")
    
    if abs(offset_x) < 3 and abs(offset_y) < 3:
        print(f"\n✅ A imagem já está centralizada (offset < 3px)!")
        print(f"   O problema de rotação tem outra causa.")
        return
    
    # Criar nova imagem centralizada
    # O novo tamanho precisa ser grande o suficiente para conter toda a roda
    # quando deslocada para centralizar
    
    # Calcular o raio máximo da roda a partir do centro real
    # (distância do centro real até a borda mais distante)
    max_dist_left = real_cx
    max_dist_right = w - real_cx
    max_dist_top = real_cy
    max_dist_bottom = h - real_cy
    max_radius = max(max_dist_left, max_dist_right, max_dist_top, max_dist_bottom)
    
    # Novo tamanho: 2 * max_radius (quadrado perfeito)
    new_size = int(max_radius * 2)
    # Garantir que é par
    if new_size % 2 != 0:
        new_size += 1
    
    print(f"\n  Novo tamanho: {new_size} x {new_size}")
    
    # Criar nova imagem transparente
    new_img = Image.new('RGBA', (new_size, new_size), (0, 0, 0, 0))
    
    # Colar a imagem original de modo que o centro real da roda
    # fique no centro da nova imagem
    paste_x = new_size // 2 - real_cx
    paste_y = new_size // 2 - real_cy
    
    new_img.paste(img, (paste_x, paste_y))
    
    # Salvar
    print(f"\n  Salvando em: {output_path}")
    new_img.save(output_path, 'PNG', optimize=True)
    
    print(f"\n{'═'*60}")
    print(f"  ✅ IMAGEM CENTRALIZADA COM SUCESSO!")
    print(f"  Novo tamanho: {new_size}x{new_size}")
    print(f"  O centro da roda agora está em ({new_size//2}, {new_size//2})")
    print(f"  transform-origin: 50% 50% vai funcionar perfeitamente!")
    print(f"{'═'*60}\n")


def main():
    if not os.path.exists(INPUT_PATH):
        print(f"❌ Arquivo não encontrado: {INPUT_PATH}")
        print(f"   Execute este script da raiz do projeto (onde está a pasta public/)")
        
        # Tentar caminhos alternativos
        alts = [
            "04.wheel-european.png",
            "wheel.png",
            "public/assets/roulette/04.wheel-european.png",
        ]
        for alt in alts:
            if os.path.exists(alt):
                print(f"   Encontrado: {alt}")
        return
    
    # Backup
    if not os.path.exists(BACKUP_PATH):
        import shutil
        shutil.copy2(INPUT_PATH, BACKUP_PATH)
        print(f"Backup salvo em: {BACKUP_PATH}")
    
    center_wheel_image(INPUT_PATH, OUTPUT_PATH)
    print("Pronto! Recarregue a página para ver o resultado.")


if __name__ == "__main__":
    main()
