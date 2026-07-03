/* ==========================================================================
   MERIDIAN — Inglês para Comex (Página de Vendas)
   JavaScript puro. Sem dependências.
   ========================================================================== */

// Evita que o navegador restaure a última posição de rolagem ao reabrir
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

/* ============================================================================
   CONFIGURAÇÃO DA TURMA — edite estas duas constantes a cada nova turma.
   Nada aqui é gerado automaticamente ou reiniciado por visitante: o prazo
   é real e igual pra todo mundo que visita a página.
   ============================================================================ */

// Data e hora (fuso do visitante) em que as inscrições da turma atual encerram.
// Formato: 'AAAA-MM-DDTHH:MM:SS'
const DEADLINE = new Date('2026-07-14T23:59:59');

// Número de vagas restantes na turma atual — atualize manualmente.
const VAGAS_RESTANTES = 7;


document.addEventListener('DOMContentLoaded', () => {
  window.scrollTo(0, 0);

  /* ------------------------------------------------------------------------
     1. Preenche o número de vagas em todos os pontos da página
  ------------------------------------------------------------------------ */
  document.querySelectorAll('#vagasInline, #vagasFinal').forEach((el) => {
    el.textContent = VAGAS_RESTANTES;
  });


  /* ------------------------------------------------------------------------
     2. Contador regressivo — atualiza a cada segundo em todos os pontos
        onde aparece (barra do topo, hero e CTA final)
  ------------------------------------------------------------------------ */
  const pad = (n) => String(n).padStart(2, '0');

  const updateCountdown = () => {
    const now = new Date();
    const diff = DEADLINE.getTime() - now.getTime();

    let days = 0, hours = 0, minutes = 0, seconds = 0;

    if (diff > 0) {
      days = Math.floor(diff / (1000 * 60 * 60 * 24));
      hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      minutes = Math.floor((diff / (1000 * 60)) % 60);
      seconds = Math.floor((diff / 1000) % 60);
    }

    // Barra de urgência (linha compacta)
    const inline = document.getElementById('countdownInline');
    if (inline) {
      inline.textContent = diff > 0
        ? `${days}d ${pad(hours)}h ${pad(minutes)}m ${pad(seconds)}s`
        : 'encerradas';
    }

    // Hero e CTA final (caixas separadas)
    const targets = [
      { d: 'cdDays', h: 'cdHours', m: 'cdMinutes', s: 'cdSeconds' },
      { d: 'cdDays2', h: 'cdHours2', m: 'cdMinutes2', s: 'cdSeconds2' },
    ];

    targets.forEach((ids) => {
      const dEl = document.getElementById(ids.d);
      const hEl = document.getElementById(ids.h);
      const mEl = document.getElementById(ids.m);
      const sEl = document.getElementById(ids.s);
      if (!dEl) return;

      dEl.textContent = pad(days);
      hEl.textContent = pad(hours);
      mEl.textContent = pad(minutes);
      sEl.textContent = pad(seconds);
    });

    // Quando o prazo acaba, avisa claramente em vez de manter zeros piscando
    if (diff <= 0) {
      const urgencyBar = document.getElementById('urgencyBar');
      if (urgencyBar) {
        urgencyBar.querySelector('.urgency-bar__text').innerHTML =
          'As inscrições dessa turma encerraram — fale com a gente pra saber sobre a próxima.';
      }
    }
  };

  updateCountdown();
  setInterval(updateCountdown, 1000);


  /* ------------------------------------------------------------------------
     3. Accordion do FAQ — um item aberto por vez
  ------------------------------------------------------------------------ */
  const accordionItems = document.querySelectorAll('.accordion__item');

  accordionItems.forEach((item) => {
    const trigger = item.querySelector('.accordion__trigger');

    trigger.addEventListener('click', () => {
      const isCurrentlyOpen = item.classList.contains('is-open');

      accordionItems.forEach((other) => {
        other.classList.remove('is-open');
        other.querySelector('.accordion__trigger').setAttribute('aria-expanded', 'false');
      });

      if (!isCurrentlyOpen) {
        item.classList.add('is-open');
        trigger.setAttribute('aria-expanded', 'true');
      }
    });
  });


  /* ------------------------------------------------------------------------
     4. Barra de CTA fixa (mobile) — aparece depois que o visitante rola
        para além do Hero, garantindo que o botão principal esteja sempre
        acessível sem poluir a primeira dobra.
  ------------------------------------------------------------------------ */
  const stickyCta = document.getElementById('stickyCta');
  const hero = document.querySelector('.hero');

  if (stickyCta && hero) {
    const heroObserver = new IntersectionObserver(
      ([entry]) => {
        stickyCta.classList.toggle('is-visible', !entry.isIntersecting);
      },
      { threshold: 0 }
    );
    heroObserver.observe(hero);
  }


  /* ------------------------------------------------------------------------
     5. Ano atual no rodapé
  ------------------------------------------------------------------------ */
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

});
