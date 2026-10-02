/**
 * Geometria do OVO principal (ovo fechado desenhado em SVG).
 *
 * As coordenadas usam a mesma área da imagem "pato-ovo-aberto" (1179 x 1428),
 * medidas diretamente na arte: a parte de baixo do ovo em SVG coincide com a
 * casca da imagem, e a rachadura segue a borda real da casca aberta.
 * Assim, quando o ovo abre, a troca SVG → imagem acontece sem "pulo".
 *
 * Se trocar a imagem do ovo aberto, ajuste EGG e CRACK aqui.
 */
import { eggPath, eggPolygon, clipToConvex, polygonPath, polylinePath } from '../../../lib/geometry.mjs';

export const VIEW = { w: 1179, h: 1428 };

/** Elipse do ovo: metade de cima (ryTop) um pouco mais alta que a de baixo (ryBottom). */
export const EGG = { cx: 582, cy: 830, rx: 458, ryTop: 600, ryBottom: 558 };

/** Área iluminada (o resto vira a sombra suave da parte de baixo, como na arte). */
const LIT = { cx: 588, cy: 800, rx: 446, ryTop: 640, ryBottom: 510 };

export const COLORS = {
  shade: '#E2D1A8',
  lit: '#F6EFD3',
  line: '#A4917A',
  crack: '#7E6B55',
};

/** Rachadura principal = borda frontal da casca aberta (da esquerda para a direita). */
export const CRACK = [
  [145, 652], [172, 628], [198, 660], [222, 645], [250, 666], [282, 674], [300, 713], [322, 700],
  [345, 692], [369, 736], [420, 822], [432, 827], [460, 804], [487, 806], [523, 765], [540, 759],
  [590, 818], [609, 851], [655, 831], [672, 813], [725, 691], [760, 712], [792, 731], [822, 714],
  [842, 682], [878, 698], [903, 675], [930, 648], [962, 672], [990, 644], [1019, 655],
];
/** Ponto onde a primeira rachadura aparece (no hover) e de onde ela se espalha. */
export const PIP = [842, 682];
const PIP_INDEX = CRACK.findIndex(([x, y]) => x === PIP[0] && y === PIP[1]);
const V_INDEX = CRACK.findIndex(([x, y]) => x === 609 && y === 851);

/** Linha da "tampa" (topo do ovo) e divisão entre as lascas esquerda/direita. */
const CAP_LINE = [
  [240, 395], [300, 372], [352, 404], [410, 366], [468, 402], [530, 370], [592, 391],
  [650, 366], [705, 404], [760, 372], [815, 400], [866, 374], [925, 392],
];
const SPLIT_TOP_INDEX = CAP_LINE.findIndex(([x, y]) => x === 592 && y === 391);
const SPLIT = [[592, 391], [610, 452], [594, 522], [616, 592], [598, 662], [622, 742], [609, 851]];

const eggPoly = eggPolygon(EGG);
const W = VIEW.w, H = VIEW.h;
const leftEdgeY = CRACK[0][1], rightEdgeY = CRACK[CRACK.length - 1][1];
const capLeftY = CAP_LINE[0][1], capRightY = CAP_LINE[CAP_LINE.length - 1][1];

const piecesRaw = {
  cap: [[0, capLeftY], ...CAP_LINE, [W, capRightY], [W, 0], [0, 0]],
  left: [
    [0, capLeftY],
    ...CAP_LINE.slice(0, SPLIT_TOP_INDEX + 1),
    ...SPLIT.slice(1),
    ...CRACK.slice(0, V_INDEX).reverse(),
    [0, leftEdgeY],
  ],
  right: [
    ...CAP_LINE.slice(SPLIT_TOP_INDEX),
    [W, capRightY],
    [W, rightEdgeY],
    ...CRACK.slice(V_INDEX + 1).reverse(),
    ...SPLIT.slice(1).reverse(),
  ],
  bottom: [[0, leftEdgeY], ...CRACK, [W, rightEdgeY], [W, H], [0, H]],
};

export const PIECES = Object.fromEntries(
  Object.entries(piecesRaw).map(([name, pts]) => [name, polygonPath(clipToConvex(pts, eggPoly))]),
);

export const PATHS = {
  egg: eggPath(EGG),
  // área iluminada recortada pelo contorno do ovo (não "vaza" para fora)
  lit: polygonPath(clipToConvex(eggPolygon(LIT, 220), eggPolygon(EGG, 220))),
  ring: eggPath({ ...EGG, rx: EGG.rx + 30, ryTop: EGG.ryTop + 30, ryBottom: EGG.ryBottom + 30 }),
  pip: `M${PIP[0] - 30} ${PIP[1] - 48}L${PIP[0] - 12} ${PIP[1] - 30}L${PIP[0]} ${PIP[1]}L${PIP[0] + 26} ${PIP[1] - 16}L${PIP[0] + 44} ${PIP[1] - 34}`,
  crackLeft: polylinePath(CRACK.slice(0, PIP_INDEX + 1).reverse()),
  crackRight: polylinePath(CRACK.slice(PIP_INDEX)),
  crackSplit: polylinePath(SPLIT),
  crackCap: polylinePath(CAP_LINE),
};

/** Centro do "flash" de luz quando o ovo abre. */
export const BURST_CENTER = [600, 600];
