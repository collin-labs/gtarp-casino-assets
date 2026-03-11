#!/usr/bin/env python3
"""
═══════════════════════════════════════════════════════════
  RECORTAR E CENTRALIZAR ROLETA — v2
  
  Abordagem diferente: em vez de deslocar,
  RECORTA a imagem para que o círculo da roda
  fique perfeitamente centralizado e preencha a imagem.
  
  COMO USAR:
  1. pip install Pillow numpy
  2. Colocar na raiz do projeto
  3. python centralizar_roleta_v2.py
═══════════════════════════════════════════════════════════
"""

from PIL import Image
import numpy as np
import os
import shutil

INPUT_PATH = "public/assets/roulette/04.wheel-european.BACKUP.png"
OUTPUT_PATH = "public/assets/roulette/04.wheel-european.png"

def find_circle_center_and_radius(img):
    """
    Encontra o centro e raio do anel dourado externo.
    Usa o fato de que o anel é o elemento mais brilhante e circular.
    """
    arr = np.array(img)
    h, w = arr.shape[:2]
    
    # Converter para luminosidade
    if arr.shape[2] == 4:
        alpha = arr[:, :, 3]
        lum = (0.299 * arr[:, :, 0] + 0.587 * arr[:, :, 1] + 0.114 * arr[:, :, 2])
        lum[alpha < 50] = 0
    else:
        lum = (0.299 * arr[:, :, 0] + 0.587 * arr[:, :, 1] + 0.114 * arr[:, :, 2])
    
    # Encontrar pixels brilhantes (anel dourado)
    threshold = 120
    bright_ys, bright_xs = np.where(lum > threshold)
    
    if len(bright_xs) < 100:
        print("  Poucos pixels brilhantes encontrados, usando threshold menor")
        threshold = 80
        bright_ys, bright_xs = np.where(lum > threshold)
    
    print(f"  Pixels brilhantes (>{threshold}): {len(bright_xs)}")
    
    # Encontrar os 4 extremos do conteúdo brilhante
    # Esses definem o diâmetro do anel externo
    top_y = np.min(bright_ys)
    bot_y = np.max(bright_ys)
    left_x = np.min(bright_xs)
    right_x = np.max(bright_xs)
    
    # Centro do bounding box circular
    cx = (left_x + right_x) / 2
    cy = (top_y + bot_y) / 2
    
    # Raio (metade do diâmetro)
    radius_x = (right_x - left_x) / 2
    radius_y = (bot_y - top_y) / 2
    radius = max(radius_x, radius_y)
    
    print(f"  Bounding box brilhante: ({left_x}, {top_y}) → ({right_x}, {bot_y})")
    print(f"  Centro: ({cx:.1f}, {cy:.1f})")
    print(f"  Raio X: {radius_x:.1f}, Raio Y: {radius_y:.1f}")
    print(f"  Raio usado: {radius:.1f}")
    print(f"  Centro da imagem: ({w/2:.1f}, {h/2:.1f})")
    print(f"  Offset: X={cx - w/2:.1f}px, Y={cy - h/2:.1f}px")
    
    return cx, cy, radius


def crop_and_center(input_path, output_path):
    print(f"\n{'═'*60}")
    print(f"  RECORTAR E CENTRALIZAR ROLETA v2")
    print(f"{'═'*60}\n")
    
    if not os.path.exists(input_path):
        # Tentar a versão sem backup
        alt = input_path.replace('.BACKUP', '')
        if os.path.exists(alt):
            input_path = alt
        else:
            print(f"❌ Arquivo não encontrado: {input_path}")
            return
    
    img = Image.open(input_path)
    print(f"Input: {input_path}")
    print(f"Tamanho: {img.size[0]} x {img.size[1]}")
    print(f"Modo: {img.mode}")
    
    if img.mode != 'RGBA':
        img = img.convert('RGBA')
    
    w, h = img.size
    
    # Encontrar centro e raio da roda
    print(f"\nAnalisando...")
    cx, cy, radius = find_circle_center_and_radius(img)
    
    # Adicionar margem de segurança (2%)
    margin = radius * 0.02
    crop_radius = radius + margin
    
    # Calcular crop box: quadrado centrado no centro da roda
    crop_left = int(cx - crop_radius)
    crop_top = int(cy - crop_radius)
    crop_right = int(cx + crop_radius)
    crop_bottom = int(cy + crop_radius)
    
    # Garantir que o crop não saia da imagem
    crop_left = max(0, crop_left)
    crop_top = max(0, crop_top)
    crop_right = min(w, crop_right)
    crop_bottom = min(h, crop_bottom)
    
    # Se o crop não é quadrado (porque bateu na borda), 
    # ajustar para ser quadrado
    crop_w = crop_right - crop_left
    crop_h = crop_bottom - crop_top
    
    if crop_w != crop_h:
        # Usar o menor lado
        side = min(crop_w, crop_h)
        # Recalcular centrado no cx, cy
        crop_left = int(cx - side / 2)
        crop_top = int(cy - side / 2)
        crop_right = crop_left + side
        crop_bottom = crop_top + side
        
        # Clamp novamente
        if crop_left < 0:
            crop_right -= crop_left
            crop_left = 0
        if crop_top < 0:
            crop_bottom -= crop_top
            crop_top = 0
        if crop_right > w:
            crop_left -= (crop_right - w)
            crop_right = w
        if crop_bottom > h:
            crop_top -= (crop_bottom - h)
            crop_bottom = h
    
    print(f"\n  Crop: ({crop_left}, {crop_top}) → ({crop_right}, {crop_bottom})")
    print(f"  Tamanho do crop: {crop_right - crop_left} x {crop_bottom - crop_top}")
    
    # Recortar
    cropped = img.crop((crop_left, crop_top, crop_right, crop_bottom))
    crop_size = cropped.size[0]  # Deve ser quadrado
    
    # Verificar se o centro da roda está no centro do crop
    new_cx = cx - crop_left
    new_cy = cy - crop_top
    new_center = crop_size / 2
    
    print(f"  Centro da roda no crop: ({new_cx:.1f}, {new_cy:.1f})")
    print(f"  Centro do crop: ({new_center:.1f}, {new_center:.1f})")
    final_offset_x = new_cx - new_center
    final_offset_y = new_cy - new_center
    print(f"  Offset residual: X={final_offset_x:.1f}px, Y={final_offset_y:.1f}px")
    
    # Se ainda tem offset significativo, corrigir criando nova imagem
    if abs(final_offset_x) > 1 or abs(final_offset_y) > 1:
        print(f"\n  Corrigindo offset residual...")
        # Criar imagem maior e colar com offset
        final_size = crop_size + int(max(abs(final_offset_x), abs(final_offset_y)) * 2) + 4
        if final_size % 2 != 0:
            final_size += 1
        
        final_img = Image.new('RGBA', (final_size, final_size), (0, 0, 0, 0))
        paste_x = int(final_size / 2 - new_cx)
        paste_y = int(final_size / 2 - new_cy)
        final_img.paste(cropped, (paste_x, paste_y))
        
        # Recortar de volta ao tamanho desejado (quadrado)
        # Usar o menor tamanho que contém toda a roda
        result = final_img
        print(f"  Tamanho final: {result.size[0]} x {result.size[1]}")
    else:
        result = cropped
    
    # Salvar
    result.save(output_path, 'PNG', optimize=True)
    
    final_w, final_h = result.size
    print(f"\n{'═'*60}")
    print(f"  ✅ IMAGEM RECORTADA E CENTRALIZADA!")
    print(f"  Tamanho: {final_w} x {final_h}")
    print(f"  Centro da roda: ({final_w//2}, {final_h//2})")
    print(f"  Salvo em: {output_path}")
    print(f"{'═'*60}\n")
    
    # Teste final: verificar o centro do resultado
    print("Verificação final...")
    result_img = Image.open(output_path)
    rcx, rcy, rr = find_circle_center_and_radius(result_img)
    rw, rh = result_img.size
    print(f"  Centro encontrado: ({rcx:.1f}, {rcy:.1f})")
    print(f"  Centro da imagem:  ({rw/2:.1f}, {rh/2:.1f})")
    print(f"  Offset final:      X={rcx - rw/2:.1f}px, Y={rcy - rh/2:.1f}px")
    total_off = ((rcx - rw/2)**2 + (rcy - rh/2)**2)**0.5
    if total_off < 5:
        print(f"  ✅ PERFEITO! Offset total: {total_off:.1f}px (< 5px)")
    else:
        print(f"  ⚠️  Offset de {total_off:.1f}px - pode precisar de ajuste manual")


if __name__ == "__main__":
    crop_and_center(INPUT_PATH, OUTPUT_PATH)
