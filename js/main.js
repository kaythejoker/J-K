(function () {
  "use strict";

  const cfg = window.JK_CONFIG;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const reduzMovimento = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Contactos */
  const linkWhats = (texto) =>
    `https://wa.me/${cfg.whatsapp}` + (texto ? `?text=${encodeURIComponent(texto)}` : "");

  $$("[data-email]").forEach((el) => (el.textContent = cfg.email));
  $$("[data-cidade]").forEach((el) => (el.textContent = cfg.cidade));
  $$("[data-whats-link]").forEach((el) => {
    el.href = linkWhats("Olá, J&K! Gostava de saber mais sobre o funcionário digital.");
  });
  $("#ano").textContent = new Date().getFullYear();

  /* Topo */
  const topo = $("#topo");
  const menu = $("#menu");
  const abrir = $(".topo__abrir");
  const aoRolar = () => topo.classList.toggle("solido", scrollY > 24);
  addEventListener("scroll", aoRolar, { passive: true });
  aoRolar();

  const definirMenu = (aberto) => {
    menu.classList.toggle("aberto", aberto);
    abrir.setAttribute("aria-expanded", String(aberto));
    abrir.setAttribute("aria-label", aberto ? "Fechar menu" : "Abrir menu");
    topo.classList.toggle("solido", aberto || scrollY > 24);
  };
  abrir.addEventListener("click", () => definirMenu(!menu.classList.contains("aberto")));
  menu.addEventListener("click", (e) => e.target.closest("a") && definirMenu(false));

  /* Fitas douradas e azuis, como as curvas do cartão de visita */
  $$(".fitas").forEach((canvas) => {
    const ctx = canvas.getContext("2d");
    const FITAS = [
      { cor: "201,154,66", linhas: 26, base: 0.86, inclina: 0.1, amp: 0.1, fase: 0, largura: 0.05 },
      { cor: "8,127,192", linhas: 20, base: 0.98, inclina: -0.2, amp: 0.08, fase: 2.1, largura: 0.07 },
    ];
    let w = 0, h = 0, visivel = false, t = 0, ultimo = 0;

    const medir = () => {
      const dpr = Math.min(devicePixelRatio || 1, 2);
      w = canvas.offsetWidth;
      h = canvas.offsetHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      desenhar();
    };

    function desenhar() {
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";
      ctx.lineWidth = 1;
      FITAS.forEach((f) => {
        for (let i = 0; i < f.linhas; i++) {
          const k = i / f.linhas;
          ctx.beginPath();
          for (let x = 0; x <= w + 24; x += 24) {
            const u = x / w;
            const onda = Math.sin(u * 3 + t + f.fase + k * 0.9) * f.amp;
            const leque = (k - 0.5) * f.largura * (0.4 + Math.sin(u * Math.PI) * 1.6);
            const y = h * (f.base + f.inclina * (u - 0.5) + onda * (0.5 + u * 0.5) + leque);
            x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
          }
          ctx.strokeStyle = `rgba(${f.cor},${0.05 + Math.sin(k * Math.PI) * 0.16})`;
          ctx.stroke();
        }
      });
    }

    function animar(agora) {
      if (!visivel) return;
      requestAnimationFrame(animar);
      if (agora - ultimo < 40) return;
      ultimo = agora;
      t += 0.0035;
      desenhar();
    }

    medir();
    addEventListener("resize", medir, { passive: true });
    if (!reduzMovimento) {
      new IntersectionObserver(([e]) => {
        const antes = visivel;
        visivel = e.isIntersecting;
        if (visivel && !antes) requestAnimationFrame(animar);
      }).observe(canvas);
    }
  });

  /* Demonstração da conversa */
  const SETORES = {
    clinica: {
      rotulo: "Clínica",
      empresa: "Clínica Sorriso",
      primeiro: "Marta",
      inicial: "Boa noite! Gostava de marcar uma consulta. Ainda dá para tratar disso hoje?",
      abertura: "Boa noite, Marta! Sou a Ana, assistente virtual da Clínica Sorriso. Dá, sim, e fica já tratado por aqui. O que procura?",
      interesses: ["Limpeza dentária", "Branqueamento", "Tenho dor de dentes"],
      pergunta: "Certo. Para quando gostaria de vir?",
      detalhes: ["O quanto antes", "Durante este mês"],
      precoLabel: "Quanto custa?",
      preco: "A primeira consulta tem um valor fixo e qualquer tratamento é explicado antes de começar, sem surpresas.",
      nome: "Consulta",
      vagas: ["Quinta às 15:00", "Sexta às 10:30"],
    },
    imobiliaria: {
      rotulo: "Imobiliária",
      empresa: "Imobiliária Ribeira",
      primeiro: "João",
      inicial: "Olá! Vi o T2 que anunciaram. Ainda está disponível?",
      abertura: "Olá, João! Sou a Ana, assistente virtual da Imobiliária Ribeira. Está disponível, sim. Como pretende avançar?",
      interesses: ["Comprar para morar", "Comprar para investir", "Arrendar"],
      pergunta: "Ótimo. Quando gostaria de visitar?",
      detalhes: ["Esta semana", "Nos próximos 15 dias"],
      precoLabel: "Qual é o preço?",
      preco: "Acabei de lhe enviar a ficha completa, com preço, planta e fotografias. A visita não tem qualquer custo.",
      nome: "Visita",
      vagas: ["Sábado às 11:00", "Terça às 18:30"],
    },
    restaurante: {
      rotulo: "Restaurante",
      empresa: "Casa da Brasa",
      primeiro: "Inês",
      inicial: "Olá! Têm mesa para este sábado à noite?",
      abertura: "Olá, Inês! Sou a Ana, assistente virtual da Casa da Brasa. Vamos ver isso já. Para quantas pessoas?",
      interesses: ["Mesa para 2", "Mesa para 6", "Jantar de empresa"],
      pergunta: "Muito bem. É alguma ocasião especial?",
      detalhes: ["Aniversário", "Sem nada de especial"],
      precoLabel: "Têm menu fixo?",
      preco: "Temos carta completa e menus fechados para grupos. Acabei de lhe enviar os dois.",
      nome: "Reserva",
      vagas: ["Sábado às 20:00", "Sábado às 21:30"],
    },
    servicos: {
      rotulo: "Serviços",
      empresa: "Silva & Associados",
      primeiro: "Rui",
      inicial: "Boa noite, queria um orçamento para a minha empresa.",
      abertura: "Boa noite, Rui! Sou a Ana, assistente virtual da Silva & Associados. Com todo o gosto. Em que área precisa de ajuda?",
      interesses: ["Contabilidade", "Consultoria fiscal", "Serviço à medida"],
      pergunta: "Perfeito. Para quando precisa disto?",
      detalhes: ["Ainda este mês", "Para o próximo trimestre"],
      precoLabel: "Qual é o preço?",
      preco: "Depende da dimensão da empresa, por isso prefiro não dar um número ao acaso. Numa reunião de 20 minutos sai um valor fechado.",
      nome: "Reunião",
      vagas: ["Amanhã às 11:00", "Quinta às 16:00"],
    },
  };

  const estado = { setor: "clinica", sessao: 0 };
  const msgs = $("#tel-msgs");
  const opcoes = $("#tel-opcoes");
  const espera = (ms) => new Promise((r) => setTimeout(r, reduzMovimento ? 0 : ms));

  // O relógio simulado avança com a conversa
  let minutos = 23 * 60 + 47;
  const relogio = () => {
    const h = Math.floor(minutos / 60) % 24;
    return `${String(h).padStart(2, "0")}:${String(minutos % 60).padStart(2, "0")}`;
  };

  function adicionarMsg(tipo, texto) {
    const el = document.createElement("div");
    el.className = `msg msg--${tipo}`;
    el.textContent = texto;
    const hora = document.createElement("small");
    hora.textContent = relogio();
    el.append(hora);
    msgs.append(el);
    msgs.scrollTop = msgs.scrollHeight;
  }

  async function responder(texto, sessao) {
    opcoes.replaceChildren();
    const pontos = document.createElement("div");
    pontos.className = "msg msg--ag msg--pontos";
    pontos.innerHTML = "<i></i><i></i><i></i>";
    msgs.append(pontos);
    msgs.scrollTop = msgs.scrollHeight;
    await espera(600 + Math.min(texto.length * 7, 700));
    if (sessao !== estado.sessao) return false;
    pontos.remove();
    adicionarMsg("ag", texto);
    return true;
  }

  function mostrarOpcoes(lista, sessao) {
    opcoes.replaceChildren();
    lista.forEach(([rotulo, acao]) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "opcao";
      b.textContent = rotulo;
      b.addEventListener("click", () => {
        if (sessao !== estado.sessao) return;
        minutos += 1;
        adicionarMsg("cli", rotulo);
        acao();
      });
      opcoes.append(b);
    });
  }

  function iniciarConversa() {
    const sessao = ++estado.sessao;
    const s = SETORES[estado.setor];
    minutos = 23 * 60 + 47;
    msgs.replaceChildren();
    $("#tel-empresa").textContent = s.empresa;
    adicionarMsg("cli", s.inicial);
    adicionarMsg("ag", s.abertura);
    passoInteresse(s, sessao);
  }

  function passoInteresse(s, sessao) {
    mostrarOpcoes(
      s.interesses.map((t) => [t, async () => {
        if (await responder(s.pergunta, sessao)) passoDetalhe(s, sessao);
      }]),
      sessao
    );
  }

  function passoDetalhe(s, sessao) {
    const vagasTexto = `Tenho ${s.vagas[0].toLowerCase()} ou ${s.vagas[1].toLowerCase()}. Qual prefere?`;
    mostrarOpcoes(
      [
        ...s.detalhes.map((t) => [t, async () => {
          if (await responder(vagasTexto, sessao)) passoVagas(s, sessao);
        }]),
        [s.precoLabel, async () => {
          if ((await responder(s.preco, sessao)) && (await responder(vagasTexto, sessao))) passoVagas(s, sessao);
        }],
      ],
      sessao
    );
  }

  function passoVagas(s, sessao) {
    mostrarOpcoes(
      [
        ...s.vagas.map((v) => [v, () => concluir(s, v, sessao)]),
        ["Preciso de pensar", async () => {
          const ok = await responder(`Sem problema, ${s.primeiro}. Guardo a opção até amanhã e volto a falar consigo às 10:00.`, sessao);
          if (ok) fim(["Contacto registado", "Opção guardada até amanhã", "Mensagem de seguimento agendada"], sessao);
        }],
      ],
      sessao
    );
  }

  async function concluir(s, vaga, sessao) {
    const ok = await responder(`Fica marcado, ${s.primeiro}. ${s.nome}: ${vaga.toLowerCase()}. Envio-lhe um lembrete na véspera.`, sessao);
    if (ok) fim(["Contacto registado", `${s.nome} na agenda: ${vaga.toLowerCase()}`, "Lembrete agendado", "Equipa avisada"], sessao);
  }

  function fim(tarefas, sessao) {
    if (sessao !== estado.sessao) return;
    const resumo = document.createElement("div");
    resumo.className = "resumo";
    const titulo = document.createElement("b");
    titulo.textContent = `Feito às ${relogio()}, sem ninguém da equipa:`;
    const lista = document.createElement("ul");
    tarefas.forEach((t) => {
      const li = document.createElement("li");
      li.textContent = t;
      lista.append(li);
    });
    resumo.append(titulo, lista);
    msgs.append(resumo);
    msgs.scrollTop = msgs.scrollHeight;

    opcoes.replaceChildren();
    const cta = document.createElement("a");
    cta.className = "opcao opcao--fim";
    cta.href = "#contacto";
    cta.textContent = "Quero isto na minha empresa";
    const denovo = document.createElement("button");
    denovo.type = "button";
    denovo.className = "opcao opcao--ghost";
    denovo.textContent = "Recomeçar";
    denovo.addEventListener("click", iniciarConversa);
    opcoes.append(denovo, cta);
  }

  const zonaSetores = $("#demo-setores");
  Object.entries(SETORES).forEach(([id, s]) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "chip";
    b.setAttribute("role", "radio");
    b.setAttribute("aria-checked", String(id === estado.setor));
    b.textContent = s.rotulo;
    b.addEventListener("click", () => {
      estado.setor = id;
      $$(".chip", zonaSetores).forEach((c) => c.setAttribute("aria-checked", String(c === b)));
      iniciarConversa();
    });
    zonaSetores.append(b);
  });
  iniciarConversa();

  /* Contacto */
  const form = $("#form-contacto");
  const pronto = $("#pronto");

  function validar(input) {
    const campo = input.closest(".campo");
    const vazio = !input.value.trim();
    campo.classList.toggle("invalido", vazio);
    $(".erro", campo).hidden = !vazio;
    return !vazio;
  }
  $$("input[required]", form).forEach((i) => i.addEventListener("input", () => validar(i)));

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const nome = $("#f-pessoa");
    const empresa = $("#f-empresa");
    const okNome = validar(nome);
    const okEmpresa = validar(empresa);
    if (!okNome) return nome.focus();
    if (!okEmpresa) return empresa.focus();

    const texto = `Olá, J&K! Sou ${nome.value.trim()}, da empresa ${empresa.value.trim()}. Quero saber como um funcionário digital pode ajudar o meu negócio.`;
    const url = linkWhats(texto);
    $("#pronto-msg").textContent = texto;
    $("#pronto-link").href = url;
    form.hidden = true;
    pronto.hidden = false;
    pronto.focus();
    window.open(url, "_blank", "noopener");
  });
})();
