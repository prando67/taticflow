export const W = 800;
export const H = 480;
export const clone = (value) => JSON.parse(JSON.stringify(value));

export const initial = () => ({
  id: crypto.randomUUID(),
  title: 'Nova jogada',
  folder: 'Geral',
  tags: [],
  favorite: false,
  half: false,
  labelMode: 'both',
  steps: [{
    players: [
      ...Array.from({ length: 5 }, (_, i) => ({ id: `a${i}`, x: 160 + (i % 2) * 110, y: 85 + i * 75, team: 'a', number: i + 1, name: '', position: '' })),
      ...Array.from({ length: 5 }, (_, i) => ({ id: `b${i}`, x: 540 + (i % 2) * 90, y: 85 + i * 75, team: 'b', number: i + 1, name: '', position: '' }))
    ],
    ball: { x: 400, y: 240 },
    arrows: [],
    lines: []
  }],
  updatedAt: Date.now(),
  shareId: null
});

function court(ctx, half) {
  // Piso de madeira de ginásio
  ctx.fillStyle = '#C88E57';
  ctx.fillRect(0, 0, W, H);
  // Tábuas discretas, sem aparência de gramado
  for (let y = 0; y < H; y += 24) {
    ctx.fillStyle = ((y / 24) % 2 === 0) ? '#D39A61' : '#BF824B';
    ctx.fillRect(0, y, W, 12);
    ctx.strokeStyle = '#A96F3E';
    ctx.lineWidth = 0.6;
    ctx.beginPath(); ctx.moveTo(0, y + 12); ctx.lineTo(W, y + 12); ctx.stroke();
  }
  ctx.strokeStyle = '#FFF8EC';
  ctx.lineWidth = 2.5;
  ctx.strokeRect(18, 18, 764, 444);
  ctx.beginPath(); ctx.moveTo(400, 18); ctx.lineTo(400, 462); ctx.stroke();
  ctx.beginPath(); ctx.arc(400, 240, 60, 0, Math.PI * 2); ctx.stroke();
  ctx.beginPath(); ctx.arc(400, 240, 3, 0, Math.PI * 2); ctx.fillStyle = '#FFF8EC'; ctx.fill();
  // Áreas de meta e pequenas áreas de goleiro
  ctx.beginPath(); ctx.moveTo(18, 150); ctx.lineTo(82, 150); ctx.arc(82, 240, 90, -Math.PI / 2, Math.PI / 2); ctx.lineTo(18, 330); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(782, 150); ctx.lineTo(718, 150); ctx.arc(718, 240, 90, -Math.PI / 2, -Math.PI * 1.5, true); ctx.lineTo(782, 330); ctx.stroke();
  ctx.strokeRect(5, 215, 13, 50); ctx.strokeRect(782, 215, 13, 50);
  // Marcas de pênalti
  ctx.beginPath(); ctx.arc(72, 240, 2.5, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(728, 240, 2.5, 0, Math.PI * 2); ctx.fill();
  if (half) {
    ctx.fillStyle = 'rgba(25, 20, 16, 0.35)';
    ctx.fillRect(0, 0, 400, H);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 17px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('MEIA QUADRA', 600, 44);
  }
}

export function draw(ctx, step, opts = {}) {
  if (!ctx || !step) return;
  const { half = false, selection = null, background = null, labelMode = 'both' } = opts;
  ctx.clearRect(0, 0, W, H);
  court(ctx, half);
  if (background) {
    ctx.save(); ctx.globalAlpha = 0.18;
    try { ctx.drawImage(background, 0, 0, W, H); } catch (_) {}
    ctx.restore();
  }
  for (const line of [...(step.lines || []), ...(step.arrows || [])]) {
    ctx.beginPath(); ctx.moveTo(line.x1, line.y1); ctx.lineTo(line.x2, line.y2);
    ctx.strokeStyle = line.color || '#FDE68A'; ctx.lineWidth = 3.5;
    ctx.setLineDash(line.dashed ? [8, 6] : []); ctx.stroke(); ctx.setLineDash([]);
    if (line.arrow || (step.arrows || []).includes(line)) {
      const angle = Math.atan2(line.y2 - line.y1, line.x2 - line.x1);
      ctx.beginPath(); ctx.moveTo(line.x2, line.y2);
      ctx.lineTo(line.x2 - 14 * Math.cos(angle - 0.5), line.y2 - 14 * Math.sin(angle - 0.5));
      ctx.lineTo(line.x2 - 14 * Math.cos(angle + 0.5), line.y2 - 14 * Math.sin(angle + 0.5));
      ctx.closePath(); ctx.fillStyle = line.color || '#FDE68A'; ctx.fill();
    }
  }
  for (const p of step.players || []) {
    ctx.beginPath(); ctx.arc(p.x, p.y, 20, 0, Math.PI * 2);
    ctx.fillStyle = p.team === 'a' ? '#2563EB' : '#E11D48'; ctx.fill();
    ctx.lineWidth = selection === p.id ? 4 : 2; ctx.strokeStyle = selection === p.id ? '#FACC15' : '#FFFFFF'; ctx.stroke();
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 14px system-ui, sans-serif';
    const number = p.number ?? '';
    if (labelMode === 'number' || labelMode === 'both' || !p.name) ctx.fillText(String(number), p.x, p.y);
    if ((labelMode === 'name' || labelMode === 'both') && p.name) {
      ctx.font = 'bold 11px system-ui, sans-serif';
      ctx.lineWidth = 3; ctx.strokeStyle = 'rgba(25, 20, 16, 0.8)';
      ctx.strokeText(p.name, p.x, p.y + 31); ctx.fillStyle = '#FFFFFF'; ctx.fillText(p.name, p.x, p.y + 31);
    }
    if (p.position && labelMode === 'both') {
      ctx.font = '10px system-ui, sans-serif'; ctx.lineWidth = 3; ctx.strokeStyle = 'rgba(25,20,16,.75)';
      ctx.strokeText(p.position, p.x, p.y + 43); ctx.fillStyle = '#FFFFFF'; ctx.fillText(p.position, p.x, p.y + 43);
    }
  }
  const ball = step.ball || { x: 400, y: 240 };
  ctx.beginPath(); ctx.arc(ball.x, ball.y, 9, 0, Math.PI * 2); ctx.fillStyle = '#FFFFFF'; ctx.fill();
  ctx.lineWidth = 2; ctx.strokeStyle = '#27272A'; ctx.stroke();
  ctx.beginPath(); ctx.arc(ball.x, ball.y, 3, 0, Math.PI * 2); ctx.fillStyle = '#27272A'; ctx.fill();
  ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
}

export const point = (canvas, event) => {
  const rect = canvas.getBoundingClientRect();
  return {
    x: Math.max(0, Math.min(W, (event.clientX - rect.left) * W / rect.width)),
    y: Math.max(0, Math.min(H, (event.clientY - rect.top) * H / rect.height))
  };
};
