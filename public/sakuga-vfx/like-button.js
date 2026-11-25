// Custom <like-button> from sakuga-vfx skills/sakuga-vfx/starter.html
(() => {
  if (typeof window === 'undefined' || !window.SakugaFX) return;
  const fx = window.SakugaFX;
  const { Spring, at, squashy, burst, ticks, puff, sfx, hollow, later } = fx;

  class LikeButton extends fx.Base {
    static delegates = true;
    static css = `
      button { width: 46px; height: 46px; display: inline-grid; place-items: center; border: var(--sk-bw) solid var(--sk-ink); border-radius: 50%; background: var(--sk-card); box-shadow: var(--sk-sh); cursor: pointer; padding: 0; }
      svg { width: 22px; height: 22px; fill: var(--sk-card); stroke: var(--sk-ink); stroke-width: 2.4; stroke-linejoin: round; transform: scale(var(--s, 1)); }
      button[aria-pressed=true] svg { fill: var(--sk-acc); }`;
    render() {
      return '<button type="button" aria-pressed="false" aria-label="Like"><svg viewBox="0 0 24 24"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/></svg></button>';
    }
    setup() {
      const b = (this.b = this.$('button'));
      if (this.hasAttribute('pressed')) {
        b.setAttribute('aria-pressed', 'true');
      }
      this.press = squashy(b, { low: 0.7, wide: 0.3 });
      this.heart = new Spring(1, 520, 11);
      this.back = this.backLayer();
      b.addEventListener('click', () => {
        const on = b.getAttribute('aria-pressed') !== 'true';
        b.setAttribute('aria-pressed', String(on));
        if (!on) {
          const c = at(b);
          puff(c.x, c.y, { size: 8, n: 3, life: 0.4 });
          this.dispatchEvent(new CustomEvent('change', { bubbles: true, detail: { liked: false } }));
          return;
        }
        this.heart.x = 0.3;
        const c = at(b);
        burst(c.x, c.y, { r: 38, life: 0.36, layer: this.back });
        ticks(c.x, c.y, { dir: -Math.PI / 2, n: 7, r: 30, len: 14, fan: 0.5, life: 0.5 });
        later(120, () => puff(c.x + 32, c.y - 24, { size: 8, n: 3, vx: 16, vy: -14 }));
        sfx('pon', c.x + 26, c.y - 58, { size: 84, ...hollow() });
        this.dispatchEvent(new CustomEvent('change', { bubbles: true, detail: { liked: true } }));
      });
    }
    frame(dt) {
      this.press.step(dt);
      this.b.style.setProperty('--s', Math.max(0, this.heart.step(dt)).toFixed(3));
    }
  }
  fx.define('like-button', LikeButton);
})();
