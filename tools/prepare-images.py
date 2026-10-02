"""
PATOX LIVE — preparação das imagens (opcional)

Gera, a partir das artes originais em src/assets/images/originals/:
  - recortes com fundo transparente (pato do logo, pato no ovo, ninhada)
  - versões otimizadas em WebP, em vários tamanhos
  - marca "Patox" (colorida e clara), favicons e imagem de compartilhamento (OG)

Só é preciso rodar este script se você TROCAR alguma arte original.
As imagens já processadas estão no projeto.

Requisitos: Python 3.10+, Pillow, numpy, scipy, opencv-python
    python3 tools/prepare-images.py
"""
from pathlib import Path

import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFont
from scipy import ndimage as ndi

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "src/assets/images/originals"
OUT = ROOT / "src/assets/images"
OUT.mkdir(parents=True, exist_ok=True)

BRAND_PURPLE = (94, 34, 166)      # --purple
BRAND_NIGHT = (29, 12, 48)        # --night
BRAND_LILAC = (243, 236, 251)     # --lilac-50
SHELL = (246, 239, 211)           # --shell


# ---------------------------------------------------------------- recorte
def cutout(name, tol_core, tol_soft, feather_bg=False, enclosed_tol=None,
           enclosed_min=150, seed_bottom=True, side_ylim=1.0):
    """Remove o fundo (liso ou com textura de penas) por preenchimento a partir das bordas."""
    rgb = np.array(Image.open(SRC / f"{name}.jpg").convert("RGB"))
    h, w, _ = rgb.shape
    lab = cv2.cvtColor(rgb, cv2.COLOR_RGB2LAB).astype(np.float32)
    border = np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]])
    ref = np.median(border, axis=0)
    d = np.sqrt(((lab - ref) ** 2).sum(-1))

    cand = d < tol_core
    if feather_bg:
        L, A, B = lab[..., 0], lab[..., 1], lab[..., 2]
        cand |= (L > 200) & (A > 131) & (A < 150) & (B > 122) & (B < 140)

    lbl, _ = ndi.label(cand)
    ylim = int(h * side_ylim)
    seeds = [lbl[0], lbl[:ylim, 0], lbl[:ylim, -1]]
    if seed_bottom:
        seeds.append(lbl[-1])
    ids = np.unique(np.concatenate(seeds))
    bg = np.isin(lbl, ids[ids > 0])

    fg = ~bg
    if not feather_bg:
        fg = ndi.binary_fill_holes(fg)
    if enclosed_tol is not None:  # miolos de letras etc.
        lbl2, n2 = ndi.label((d < enclosed_tol) & fg)
        sizes = ndi.sum(np.ones_like(lbl2), lbl2, index=np.arange(1, n2 + 1))
        for i, s in enumerate(sizes, start=1):
            if s >= enclosed_min:
                fg &= ~(lbl2 == i)

    lblf, nf = ndi.label(fg)
    sizes = ndi.sum(np.ones_like(lblf), lblf, index=np.arange(1, nf + 1))
    keep = np.zeros(nf + 1, bool)
    keep[1:] = sizes > 300
    fg = keep[lblf]

    inner = ndi.binary_erosion(fg, iterations=2)
    band = fg & ~inner
    outer = ndi.binary_dilation(fg, iterations=1) & ~fg
    if feather_bg:
        m = (~fg).astype(np.float32)
        num = cv2.GaussianBlur(lab * m[..., None], (31, 31), 0)
        den = cv2.GaussianBlur(m, (31, 31), 0)[..., None] + 1e-4
        local = num / den
        dd = np.sqrt(((lab - local) ** 2).sum(-1))
        local_rgb = cv2.cvtColor(np.clip(local, 0, 255).astype(np.uint8), cv2.COLOR_LAB2RGB).astype(np.float32)
    else:
        dd = d
        ref_rgb = cv2.cvtColor(ref.reshape(1, 1, 3).astype(np.uint8), cv2.COLOR_LAB2RGB).astype(np.float32)
        local_rgb = np.broadcast_to(ref_rgb, rgb.shape)

    a = np.clip((dd - tol_core * 0.6) / (tol_soft - tol_core * 0.6), 0, 1)
    alpha = np.zeros((h, w), np.float32)
    alpha[inner] = 1
    alpha[band] = a[band]
    alpha[outer] = np.clip(a[outer] * 0.9, 0, 1) * (dd[outer] > tol_core * 0.9)
    alpha = cv2.GaussianBlur(alpha, (3, 3), 0.6)
    alpha[inner] = 1

    # remove a "franja" da cor do fundo nas bordas semitransparentes
    C = rgb.astype(np.float32)
    a3 = np.clip(alpha, 0.05, 1)[..., None]
    F = np.clip((C - (1 - a3) * local_rgb) / a3, 0, 255)
    edge = (alpha > 0) & (alpha < 0.999)
    C[edge] = F[edge]
    return Image.fromarray(np.dstack([C, alpha * 255]).astype(np.uint8), "RGBA")


# ---------------------------------------------------------------- exportação
def save_webp(img, stem, widths, quality=86):
    written = []
    for wdt in widths:
        im = img
        if img.width != wdt:
            hgt = round(img.height * wdt / img.width)
            im = img.resize((wdt, hgt), Image.LANCZOS)
        path = OUT / f"{stem}-{wdt}.webp"
        im.save(path, "WEBP", quality=quality, method=6)
        written.append(path.name)
    return written


def mono(img, color):
    """Versão de uma cor só (para fundos escuros), preservando o alfa."""
    a = img.getchannel("A")
    solid = Image.new("RGBA", img.size, color + (255,))
    solid.putalpha(a)
    return solid


def rounded_square(size, color, radius_ratio=0.22):
    im = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    ImageDraw.Draw(im).rounded_rectangle((0, 0, size - 1, size - 1), radius=int(size * radius_ratio), fill=color + (255,))
    return im


def main():
    logo = cutout("pato-logo", tol_core=10, tol_soft=40, enclosed_tol=6)
    ovo = cutout("pato-ovo-aberto", tol_core=10, tol_soft=40, enclosed_tol=6)
    ninhada = cutout("pato-ninhada", tol_core=14, tol_soft=45, feather_bg=True, seed_bottom=False, side_ylim=0.78)

    # 1. Pato do logo (hero) — só o personagem, sem a marca escrita
    duck = logo.crop((236, 155, 797, 761))
    print("hero:", save_webp(duck, "pato-hero", [400, 561], quality=88))

    # 1b. Avatar redondo do pato (prévia da conversa no WhatsApp)
    head = logo.crop((360, 140, 680, 460))
    for size in (96, 192):
        av = Image.new("RGBA", (size, size), BRAND_LILAC + (255,))
        av.alpha_composite(head.resize((size, size), Image.LANCZOS))
        av.save(OUT / f"pato-avatar-{size}.webp", "WEBP", quality=88, method=6)
    print("avatar: pato-avatar-96.webp, pato-avatar-192.webp")

    # 2. Pato saindo do ovo — mantém a tela inteira (1179x1428) para alinhar com o ovo em SVG
    print("ovo aberto:", save_webp(ovo, "pato-ovo-aberto", [600, 900, 1179], quality=86))

    # 3. Suporte e ninhada com o fundo original de penas (moldura "pôster")
    for name in ("pato-suporte", "pato-ninhada"):
        img = Image.open(SRC / f"{name}.jpg").convert("RGB")
        print(name + ":", save_webp(img, name, [520, 800, img.width], quality=82))

    # 4. Ninhada recortada (CTA final)
    print("ninhada recorte:", save_webp(ninhada, "pato-ninhada-recorte", [600, 900, 1179], quality=86))

    # 5. Marca "Patox" (colorida + clara para fundos escuros)
    wordmark = logo.crop((280, 756, 742, 894))
    for variant, img in (("patox-marca", wordmark), ("patox-marca-clara", mono(wordmark, SHELL))):
        for wdt in (240, 462):
            im = img if wdt == img.width else img.resize((wdt, round(img.height * wdt / img.width)), Image.LANCZOS)
            im.save(OUT / f"{variant}-{wdt}.webp", "WEBP", quality=90, alpha_quality=100, method=6)

    # 6. Símbolo "P" → favicons
    region = logo.crop((276, 752, 400, 892))
    arr = np.array(region)
    lbl, n = ndi.label(arr[..., 3] > 40)
    sizes = ndi.sum(np.ones_like(lbl), lbl, index=np.arange(1, n + 1))
    main_id = int(np.argmax(sizes)) + 1          # o maior componente é o "P"
    arr[..., 3] = np.where(lbl == main_id, arr[..., 3], 0)
    p_mark = Image.fromarray(arr, "RGBA")
    p_mark = p_mark.crop(p_mark.getbbox())
    for size, fname in ((32, "favicon-32.png"), (192, "icon-192.png"), (512, "icon-512.png"), (180, "apple-touch-icon.png")):
        base = rounded_square(size, BRAND_NIGHT, 0.0 if fname.startswith("apple") else 0.24)
        inner = int(size * 0.66)
        pm = p_mark.resize((round(inner * p_mark.width / p_mark.height), inner), Image.LANCZOS)
        base.alpha_composite(pm, ((size - pm.width) // 2 + round(size * 0.02), (size - pm.height) // 2))
        if fname.startswith("apple"):
            base = base.convert("RGB")
        base.save(OUT / fname)
    ico = rounded_square(64, BRAND_NIGHT, 0.24)
    pm = p_mark.resize((round(44 * p_mark.width / p_mark.height), 44), Image.LANCZOS)
    ico.alpha_composite(pm, ((64 - pm.width) // 2 + 1, (64 - pm.height) // 2))
    ico.save(OUT / "favicon.ico", sizes=[(16, 16), (32, 32), (48, 48)])

    # 7. Imagem de compartilhamento (1200x630) — WhatsApp, Instagram, etc.
    og = Image.new("RGBA", (1200, 630), BRAND_LILAC + (255,))
    draw = ImageDraw.Draw(og)
    d = duck.resize((round(duck.width * 0.92), round(duck.height * 0.92)), Image.LANCZOS)
    cx = 880
    # ovo escuro: o pato "sai" pela borda de cima
    draw.ellipse((cx - 215, 215, cx + 215, 760), fill=BRAND_NIGHT + (255,))
    og.alpha_composite(d, (cx - d.width // 2, 630 - d.height + 30))
    wm = wordmark.resize((round(wordmark.width * 1.08), round(wordmark.height * 1.08)), Image.LANCZOS)
    og.alpha_composite(wm, (78, 190))
    try:
        font = ImageFont.truetype("DejaVuSans-Bold.ttf", 34)
        small = ImageFont.truetype("DejaVuSans-Bold.ttf", 34)
    except OSError:
        font = small = ImageFont.load_default()
    # selo LIVE ao lado da marca (PATOX LIVE) + frase de apoio
    x0, y0 = 78 + wm.width + 16, 190 + wm.height - 66
    draw.rounded_rectangle((x0, y0, x0 + 116, y0 + 54), radius=14, fill=(233, 30, 86, 255))
    draw.text((x0 + 58, y0 + 28), "LIVE", font=font, fill=(255, 255, 255, 255), anchor="mm")
    draw.text((86, 190 + wm.height + 48), "Agência de TikTok LIVE", font=small, fill=BRAND_NIGHT + (255,), anchor="lm")
    og.convert("RGB").save(OUT / "og-image.jpg", "JPEG", quality=86, optimize=True, progressive=True)
    print("ok: marca, favicons, og-image")


if __name__ == "__main__":
    main()
