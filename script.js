// Script për logjikën e testit: inpute, renditje, plotësime, kohëmatës, confetti
document.addEventListener('DOMContentLoaded', ()=>{

  // ---- KONFIGURIMI I PYETJEVE DHE VLERËSIMI ----
  const maxScore = 20;
  document.getElementById('max-score').textContent = maxScore;

  // Tani kemi 3 ushtrime (input, ordering, fill)
  let scores = [0,0,0];

  const shuffle = (arr)=> arr.map(v=>({v, r:Math.random()})).sort((a,b)=>a.r-b.r).map(x=>x.v);

  // ---- Ushtrimi 1 (ish Ushtrimi 3): Pyetje me input (përgjigje të shkruara) ----
  const inputQs = [
    { q: "Cili ishte roli i qyteteve ilire në zhvillimin e kulturës? (1 pikë)", a: "1912" },
    { q: "Cilat ishin marrëdhëniet e ilirëve me grekët dhe romakët? (1 pikë)", a: "Vlorë" },
    { q: "Çfarë ndikimi pati pushtimi romak në trevat ilire? (1 pikë)", a: "Ismail Qemali" },
    { q: "Si lidhet kultura ilire me atë shqiptare? (1 pikë)", a: "1920" },
    { q: "Çfarë tregon përhapja e toponimeve ilire në trojet shqiptare? (1 pikë)", a: "Naim Frashëri" },
    { q: "Si ndikuan ilirët në identitetin etnik shqiptar? (1 pikë)", a: "Shpallja e Pavarësisë" },
    { q: "Çfarë roli kishte Kisha në jetën mesjetare shqiptare? (1 pikë)", a: "Vlorë" },
    { q: "Si u formua Principata e Arbërit? (1 pikë)", a: "Ahmet Zogu" },
    { q: "Cila ishte rëndësia e Skënderbeut në Mesjetë? (1 pikë)", a: "Lushnjë" },
    { q: "Çfarë ndikimi pati pushtimi osman në shoqërinë shqiptare? (1 pikë)", a: "1957" },
    { q: "Si u ruajt gjuha dhe kultura shqiptare gjatë pushtimit osman? (1 pikë)", a: "Nënë Tereza" },
    { q: "Si lidhet Mesjeta shqiptare me zhvillimin e identitetit kombëtar? (1 pikë)", a: "2009" }
  ];
  // Këtu japim 1 pikë për secilën përgjigje të saktë (max 12)
  const inputContainer = document.getElementById('input-questions');
  inputContainer.innerHTML = '';
  inputQs.forEach((it, idx)=>{
    const div = document.createElement('div');
    div.className = 'quiz-item';
    div.innerHTML = `<div><strong>Pyetja ${idx+1}:</strong> ${it.q}</div>
      <div style="margin-top:8px"><input type="text" class="text-answer" data-idx="${idx}" placeholder="Shkruaj përgjigjen këtu" style="padding:8px;border-radius:8px;border:1px solid rgba(0,0,0,0.12);width:100%"></div>`;
    inputContainer.appendChild(div);
  });

  document.getElementById('submit-inputs').addEventListener('click', ()=>{
    let s = 0;
    const inputs = document.querySelectorAll('.text-answer');
    inputs.forEach(inp=>{
      const idx = +inp.dataset.idx;
      const val = (inp.value||'').trim().toLowerCase();
      const expect = inputQs[idx].a.trim().toLowerCase();
      inp.style.border = '';
      if(val.length && val === expect){
        s += 1;
        inp.style.border = `2px solid #22c55e`; // success
        fireConfetti(10);
      } else {
        inp.style.border = `2px solid #ef4444`; // danger
        inp.animate([{transform:'translateX(0)'},{transform:'translateX(-6px)'},{transform:'translateX(6px)'},{transform:'translateX(0)'}],{duration:400});
      }
    });
    scores[0] = s; // ushtrimi i parë në këtë version
    document.getElementById('score-1').textContent = scores[0];
  });

  // ---- Ushtrimi 2 (ish Ushtrimi 4): Rendit ngjarjet historike me SortableJS ----
  (function initOrderingWithSortable(){
    const eventsOrdered = [
      {id:'e1', text:'Iliri '},
      {id:'e2', text:'Dyndjet sllave'},
      {id:'e3', text:'Mbreteria Ardiane'},
      {id:'e4', text:'Pushtimi Osman I trevave Shqiprtare'},
      {id:'e5', text:'Lufta e trete Iliro-Romake'}
    ];

    const sortableEl = document.getElementById('sortable-events');
    if(!sortableEl){
      console.warn('Ushtrimi 4: element #sortable-events nuk u gjet në DOM.');
      return;
    }

    sortableEl.innerHTML = '';
    const shuffled = shuffle(eventsOrdered.slice());
    shuffled.forEach(ev=>{
      const li = document.createElement('li');
      li.draggable = true;
      li.id = ev.id;
      li.className = 'sortable-item';
      li.textContent = ev.text;
      li.addEventListener('selectstart', e => e.preventDefault());
      sortableEl.appendChild(li);
    });

    if(typeof Sortable === 'undefined'){
      console.warn('SortableJS nuk u gjet. Sigurohu që CDN-i u përfshi para script.js.');
    } else {
      Sortable.create(sortableEl, {
        animation: 150,
        ghostClass: 'sortable-ghost',
        fallbackOnBody: true,
        swapThreshold: 0.65
      });
    }

    const submitOrderBtn = document.getElementById('submit-order');
    if(!submitOrderBtn){
      console.warn('Ushtrimi 4: butoni #submit-order mungon.');
      return;
    }
    submitOrderBtn.addEventListener('click', ()=>{
      const items = Array.from(sortableEl.children);
      let s = 0;
      items.forEach((it, idx)=>{
        const expectedId = eventsOrdered[idx].id;
        it.classList.remove('correct','wrong');
        if(it.id === expectedId){
          it.classList.add('correct');
          s++;
          fireConfetti(6);
        } else {
          it.classList.add('wrong');
        }
      });
      scores[1] = s; // renditja është ushtrimi i dytë në këtë version
      const scoreEl = document.getElementById('score-2');
      if(scoreEl) scoreEl.textContent = s;
    });
  })();

  // ---- Ushtrimi 3 (ish Ushtrimi 5): Plotëso boshllëqet ----
  const blanks = ["osmanët", "gjuhës", "zakoneve"];
  const bankWords = shuffle(blanks.concat([]));
  const fillBank = document.getElementById('fill-bank');
  fillBank.innerHTML = '';
  bankWords.forEach((w, idx)=>{
    const f = document.createElement('div');
    f.className = 'fill-word';
    f.draggable = true;
    f.id = `fill-${idx}`;
    f.textContent = w;
    f.dataset.word = w;
    f.addEventListener('dragstart', fillDragStart);
    f.addEventListener('dragend', fillDragEnd);
    fillBank.appendChild(f);
  });

  document.querySelectorAll('.blank').forEach(blank=>{
    blank.addEventListener('dragover', e=>{ e.preventDefault(); blank.classList.add('over') });
    blank.addEventListener('dragleave', e=>{ blank.classList.remove('over') });
    blank.addEventListener('drop', e=>{
      e.preventDefault();
      blank.classList.remove('over');
      const id = e.dataTransfer.getData('text/plain');
      const el = document.getElementById(id);
      if(!el) return;
      blank.textContent = '';
      blank.appendChild(el);
    });
  });

  function fillDragStart(e){
    e.dataTransfer.setData('text/plain', e.target.id);
    e.target.classList.add('dragging');
  }
  function fillDragEnd(e){
    e.target.classList.remove('dragging');
  }

  document.getElementById('submit-fill').addEventListener('click', ()=>{
    let s = 0;
    document.querySelectorAll('.blank').forEach((b, idx)=>{
      b.classList.remove('correct','wrong');
      const child = b.querySelector('.fill-word');
      if(child){
        const val = child.dataset.word.trim();
        if(val === blanks[idx]){
          b.classList.add('correct');
          child.classList.add('correct');
          s++;
          fireConfetti(12);
        } else {
          b.classList.add('wrong');
          child.classList.add('wrong');
          child.animate([{transform:'translateX(0)'},{transform:'translateX(-6px)'},{transform:'translateX(6px)'},{transform:'translateX(0)'}],{duration:450});
        }
      } else {
        b.classList.add('wrong');
      }
    });
    scores[2] = s; // ushtrimi i tretë
    document.getElementById('score-3').textContent = scores[2];
  });

  // ---- Submit All & Rezultati Final ----
  document.getElementById('submit-all').addEventListener('click', showResults);
  document.getElementById('restart').addEventListener('click', ()=> location.reload());

  function showResults(){
    const total = scores.reduce((a,b)=>a+b,0);
    document.getElementById('total-score').textContent = total;
    if(total >= Math.round(maxScore*0.6)){
      fireConfetti(60);
    } else {
      fireConfetti(20);
    }
    document.getElementById('summary').scrollIntoView({behavior:'smooth'});
  }

  // ---- Timer 5 minuta ----
  let totalSeconds = 5 * 60;
  const timerEl = document.getElementById('timer');
  const timerInterval = setInterval(()=>{
    totalSeconds--;
    if(totalSeconds < 0){
      clearInterval(timerInterval);
      autoSubmitAll();
      return;
    }
    const mm = String(Math.floor(totalSeconds/60)).padStart(2,'0');
    const ss = String(totalSeconds%60).padStart(2,'0');
    if(timerEl) timerEl.textContent = `${mm}:${ss}`;
  }, 1000);

  function autoSubmitAll(){
    // Auto-submit vetëm ushtrimet ekzistuese
    const subInputs = document.getElementById('submit-inputs');
    const subOrder = document.getElementById('submit-order');
    const subFill = document.getElementById('submit-fill');
    if(subInputs) subInputs.click();
    if(subOrder) subOrder.click();
    if(subFill) subFill.click();
    showResults();
    alert('Koha mbaroi! Rezultati u dorëzua automatikisht.');
  }

  // ---- Confetti (thjeshtë, pa external libs) ----
  const confettiCanvas = document.getElementById('confetti-canvas');
  const confettiCtx = confettiCanvas.getContext ? confettiCanvas.getContext('2d') : null;
  let W = confettiCanvas.width = window.innerWidth;
  let H = confettiCanvas.height = window.innerHeight;
  window.addEventListener('resize', ()=>{ W = confettiCanvas.width = window.innerWidth; H = confettiCanvas.height = window.innerHeight; });

  let confettiParticles = [];
  function fireConfetti(count=40){
    if(!confettiCtx) return;
    for(let i=0;i<count;i++){
      confettiParticles.push(createParticle());
    }
    if(!confettiLoopRunning) startConfettiLoop();
  }
  function createParticle(){
    const colors = ['#ff6b6b','#ffd166','#6ee7b7','#60a5fa','#a78bfa','#f472b6'];
    return {
      x: Math.random()*W,
      y: -20 - Math.random()*100,
      w: 6+Math.random()*8,
      h: 6+Math.random()*8,
      r: Math.random()*360,
      color: colors[Math.floor(Math.random()*colors.length)],
      vx: (Math.random()-0.5)*4,
      vy: 2+Math.random()*6,
      vr: (Math.random()-0.5)*10,
      life: 200 + Math.random()*80
    }
  }
  let confettiLoopRunning = false;
  function startConfettiLoop(){
    confettiLoopRunning = true;
    (function loop(){
      confettiCtx.clearRect(0,0,W,H);
      for(let i = confettiParticles.length-1; i>=0; i--){
        const p = confettiParticles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.06;
        p.r += p.vr;
        p.life--;
        confettiCtx.save();
        confettiCtx.translate(p.x,p.y);
        confettiCtx.rotate(p.r*Math.PI/180);
        confettiCtx.fillStyle = p.color;
        confettiCtx.fillRect(-p.w/2, -p.h/2, p.w, p.h);
        confettiCtx.restore();
        if(p.y > H + 60 || p.life <= 0) confettiParticles.splice(i,1);
      }
      if(confettiParticles.length>0) requestAnimationFrame(loop);
      else confettiLoopRunning = false;
    })();
  }

  // finalize: update total score dynamically
  function updateTotalDisplay(){
    const total = scores.reduce((a,b)=>a+b,0);
    document.getElementById('total-score').textContent = total;
  }
  setInterval(updateTotalDisplay, 1000);

  // ---- Peer assessment (Vlerësimi i Grupit) ----
  (function initPeerAssessment(){
    const form = document.getElementById('vleresimiForm');
    if(!form) return;

    const errorMessage = document.getElementById('error-message');
    const rezultatiDiv = document.getElementById('rezultati');
    const resUne = document.getElementById('res_une');
    const resEmri = document.getElementById('res_emri_a');
    const resPika = document.getElementById('res_pika_a');

    form.addEventListener('submit', function(event){
      event.preventDefault();

      const pika_une = parseInt(document.getElementById('pika_une').value, 10) || 0;
      const pika_aneter_a = parseInt(document.getElementById('pika_aneter_a').value, 10) || 0;
      const emri_aneter_a = document.getElementById('emri_aneter_a').value.trim();

      const total = pika_une + pika_aneter_a;

      if(total !== 10){
        if(errorMessage) errorMessage.style.display = 'block';
        rezultatiDiv.style.display = 'none';
        return;
      }

      if(emri_aneter_a === ""){
        if(errorMessage) errorMessage.style.display = 'block';
        rezultatiDiv.style.display = 'none';
        return;
      }

      if(errorMessage) errorMessage.style.display = 'none';
      if(resUne) resUne.textContent = pika_une;
      if(resEmri) resEmri.textContent = emri_aneter_a;
      if(resPika) resPika.textContent = pika_aneter_a;
      rezultatiDiv.style.display = 'block';

      try {
        const saved = {
          vetja: pika_une,
          anetar: { emri: emri_aneter_a, pike: pika_aneter_a },
          timestamp: new Date().toISOString()
        };
        localStorage.setItem('peerAssessment', JSON.stringify(saved));
      } catch (err) {}
    });

    try {
      const previous = JSON.parse(localStorage.getItem('peerAssessment') || 'null');
      if(previous && previous.anetar){
        if(resUne) resUne.textContent = previous.vetja;
        if(resEmri) resEmri.textContent = previous.anetar.emri;
        if(resPika) resPika.textContent = previous.anetar.pike;
        rezultatiDiv.style.display = 'block';
      }
    } catch (err){}
  })();

});