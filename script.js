<<<<<<< HEAD
// Script për logjikën e testit: pyetjet, drag/drop, renditje, plotësime, kohëmatës, confetti
document.addEventListener('DOMContentLoaded', ()=>{

  // ---- KONFIGURIMI I PYETJEVE DHE VLERËSIMI ----
  const maxScore = 30;
  document.getElementById('max-score').textContent = maxScore;

  let scores = [0,0,0,0,0]; // pesë ushtrime

  // Ushtrimi 1: 7 quiz questions
  const quizQuestions = [
    {q:"1.Cili është qytetërimi antik që konsiderohet si parardhës i shqiptarëve?", opts:["a) Grekët","b) Ilirët","c) Dakëti","d)Romakët"], a:3},
    {q:"2.Cili ishte vendbanimi më i njohur i ilirëve në territorin e sotëm të Shqipërisë?  ", opts:["a)Apolonia","b)Dyrrahu","c)Shkodra","d)Butrinti"], a:0},
    {q:"3.Cila ishte arsyeja kryesore e luftërave iliro-romake?", opts:["a)Konfliktet fetare","b)Kontrolli i detit Adriatik","c)Tregtia me Greqinë","d)Shpërnguljet e popullsisë"], a:0},
    {q:"4.Përmend dy elementë të trashëgimisë kulturore që dëshmojnë vazhdimësinë ilire në trevat shqiptare.", opts:["Konferenca e Parisit","Konferenca e Ambasadorëve","Konferenca e Londrës","Konferenca e Versajës"], a:1},
    {q:"5.Cili ishte formacioni politik më i rëndësishëm shqiptar në shek. XIV?  ", opts:["a)Principata e Dukagjinëve","b) Principata e Muzakajve","c)Principata e Balshajve","d)Principata e Topiajve"], a:0},
    {q:"6.Cili ishte qëllimi kryesor i Kuvendit të Lezhës në vitin 1444?  ", opts:["a)Të ndante territoret shqiptare","b)Të bashkonte forcat kundër osmanëve","c)Të zgjidhte një princ të ri ","d)Të nënshkruante paqe me Venedikun"], a:0},
   
    
  ];
  // Shto 7 pyetje të reja në quizQuestions (vendoseni pas deklarimit origjinal të quizQuestions)
quizQuestions.push(
  {
    q: "9.Cila nga këto është një pasojë e pushtimit osman në jetën e shqiptarëve?",
    opts: ["a)Rritja e tregtisë me Evropën ","b)Përhapja e fesë islame ","c)Zhvillimi i qyteteve të pavarura","d)Liria e plotë fetare"],
    a: 0
  },
 
  
);

  // Rnd shuffle helper
  const shuffle = (arr)=> arr.map(v=>({v, r:Math.random()})).sort((a,b)=>a.r-b.r).map(x=>x.v);

  // Rregullo dhe rendit quiz në DOM
  const quizContainer = document.getElementById('quiz-container');
  quizQuestions.forEach((item, idx)=>{
    const div = document.createElement('div');
    div.className = 'quiz-item';
    div.innerHTML = `<strong>Pyetja ${idx+1}:</strong> <div class="qtext">${item.q}</div>`;
    const optsDiv = document.createElement('div');
    optsDiv.className = 'options';
    const opts = shuffle(item.opts.map((o,i)=>({o,i})));
    opts.forEach(opt=>{
      const b = document.createElement('div');
      b.className = 'option';
      b.tabIndex = 0;
      b.dataset.q = idx;
      b.dataset.choice = opt.i;
      b.textContent = opt.o;
      b.addEventListener('click', ()=>selectOption(b));
      optsDiv.appendChild(b);
    });
    div.appendChild(optsDiv);
    quizContainer.appendChild(div);
  });

  function selectOption(el){
    const qIdx = +el.dataset.q;
    // deselect siblings
    const siblings = el.parentElement.querySelectorAll('.option');
    siblings.forEach(s=>s.classList.remove('selected'));
    el.classList.add('selected');
  }

  document.getElementById('submit-quiz').addEventListener('click', ()=>{
    let s = 0;
    // për secilën pyetje shiko përzgjedhjen
    const items = quizContainer.querySelectorAll('.quiz-item');
    items.forEach((it, idx)=>{
      const chosen = it.querySelector('.option.selected');
      const opts = it.querySelectorAll('.option');
      opts.forEach(o => o.classList.remove('correct','wrong'));
      if(chosen){
        const choiceVal = +chosen.dataset.choice;
        if(choiceVal === quizQuestions[idx].a){
          chosen.classList.add('correct');
          s++;
          fireConfetti(15);
        } else {
          chosen.classList.add('wrong');
          // show correct option
          opts.forEach(o=>{ if(+o.dataset.choice === quizQuestions[idx].a) o.classList.add('correct') });
        }
      } else {
        // mark correct visibly
        opts.forEach(o=>{ if(+o.dataset.choice === quizQuestions[idx].a) o.classList.add('correct') });
      }
    });
    scores[0] = s; // 1 pikë per pyetje -> 7 max
    document.getElementById('score-1').textContent = scores[0];
  });


  // ---- Ushtrimi 2: 2 rrethe & drag/drop (5 per rreth) ----
  // Për këtë shembull kemi 10 përgjigje, secila është e detyruar për rrethin A ose B
  const circleData = [
    {id:'p1', text:'Progoni', target:'A'},
    {id:'p2', text:'Strazimiri', target:'A'},
    {id:'p3', text:'Dhimitri', target:'A'},
    {id:'p4', text:'Shkodra', target:'B'},
    {id:'p5', text:'Shqiperia e Veriut', target:'B'},
    {id:'p6', text:'Besimi Katolik', target:'A'},
    {id:'p7', text:'Ne veri kufizohej me Pejen dhe Prizerenin', target:'B'},
    {id:'p8', text:'Kruja', target:'A'},
    {id:'p9', text:'Përpjekje për reforma', target:'B'},
    {id:'p10', text:'Shtrirja Drini-Shkumbin', target:'A'}
  ];
  // Shuffle and add to bank
  const bank = document.getElementById('drag-bank');
  const dragItems = shuffle(circleData.slice());
  dragItems.forEach(it=>{
    const d = document.createElement('div');
    d.className = 'draggable';
    d.draggable = true;
    d.id = it.id;
    d.textContent = it.text;
    d.dataset.target = it.target;
    d.addEventListener('dragstart', dragStart);
    d.addEventListener('dragend', dragEnd);
    bank.appendChild(d);
  });

  // Setup drop areas
  document.querySelectorAll('.drop-area').forEach(area=>{
    area.addEventListener('dragover', e=>{ e.preventDefault(); area.classList.add('over') });
    area.addEventListener('dragleave', e=>{ area.classList.remove('over') });
    area.addEventListener('drop', e=>{
      e.preventDefault();
      area.classList.remove('over');
      const id = e.dataTransfer.getData('text/plain');
      const el = document.getElementById(id);
      if(el) area.appendChild(el);
    });
  });

  function dragStart(e){
    e.dataTransfer.setData('text/plain', e.target.id);
    e.target.classList.add('dragging');
  }
  function dragEnd(e){
    e.target.classList.remove('dragging');
  }

  document.getElementById('submit-circles').addEventListener('click', ()=>{
    // check items inside each circle
    const Aarea = document.querySelector('#circle-A .drop-area');
    const Barea = document.querySelector('#circle-B .drop-area');
    let s = 0;
    // helper to check children
    [Aarea, Barea].forEach(area=>{
      const children = Array.from(area.querySelectorAll('.draggable'));
      children.forEach(ch=>{
        ch.classList.remove('correct','wrong');
        const expected = ch.dataset.target;
        const here = (area.id.includes('A')?'A':'B');
        if(expected === here){
          ch.classList.add('correct');
          s++;
          fireConfetti(8);
        } else {
          ch.classList.add('wrong');
        }
      });
    });
    // items still in bank untreated: mark as wrong if target requires dropping
    const remaining = Array.from(bank.querySelectorAll('.draggable'));
    remaining.forEach(r=>{
      r.classList.remove('correct','wrong');
    });
    scores[1] = s; // 1 pikë për çdo vendosje të saktë (max 10)
    document.getElementById('score-2').textContent = scores[1];
  });


  // ---- Ushtrimi 3: Pyetje me input (përgjigje të shkruara) ----
  const inputQs = [
  { q: "Cili ishte roli i qyteteve ilire në zhvillimin e kulturës? (3 pikë)", a: "1912" },
  { q: "Cilat ishin marrëdhëniet e ilirëve me grekët dhe romakët? (3 pikë)", a: "Vlorë" },
  { q: "Çfarë ndikimi pati pushtimi romak në trevat ilire? (3 pikë)", a: "Ismail Qemali" },
  { q: "Si lidhet kultura ilire me atë shqiptare? (3 pikë)", a: "1920" },
  { q: "Çfarë tregon përhapja e toponimeve ilire në trojet shqiptare? (3 pikë)", a: "Naim Frashëri" },
  { q: "Si ndikuan ilirët në identitetin etnik shqiptar? (4 pikë)", a: "Shpallja e Pavarësisë" },
  { q: "Çfarë roli kishte Kisha në jetën mesjetare shqiptare? (3 pikë)", a: "Vlorë" },
  { q: "Si u formua Principata e Arbërit? (3 pikë)", a: "Ahmet Zogu" },
  { q: "Cila ishte rëndësia e Skënderbeut në Mesjetë? (4 pikë)", a: "Lushnjë" },
  { q: "Çfarë ndikimi pati pushtimi osman në shoqërinë shqiptare? (3 pikë)", a: "1957" },
  { q: "Si u ruajt gjuha dhe kultura shqiptare gjatë pushtimit osman? (4 pikë)", a: "Nënë Tereza" },
  { q: "Si lidhet Mesjeta shqiptare me zhvillimin e identitetit kombëtar? (4 pikë)", a: "2009" }
];
  const inputContainer = document.getElementById('input-questions');
  inputQs.forEach((it, idx)=>{
    const div = document.createElement('div');
    div.className = 'quiz-item';
    div.innerHTML = `<div><strong>Pyetja ${idx+1}:</strong> ${it.q}</div>
      <div style="margin-top:8px"><input type="text" class="text-answer" data-idx="${idx}" placeholder="Shkruaj përgjigjen këtu" style="padding:8px;border-radius:8px;border:1px solid rgba(255,255,255,0.04);width:100%"></div>`;
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
        inp.style.border = `2px solid var(--success)`;
        fireConfetti(10);
      } else {
        inp.style.border = `2px solid var(--danger)`;
        // small shake
        inp.animate([{transform:'translateX(0)'},{transform:'translateX(-6px)'},{transform:'translateX(6px)'},{transform:'translateX(0)'}],{duration:400});
      }
    });
    scores[2] = s; // 1 pikë per përgjigje -> max 3
    document.getElementById('score-3').textContent = scores[2];
  });


  // ---- Ushtrimi 4: Rendit ngjarjet historike ----
  // ---- Ushtrimi 4: Rendit ngjarjet historike me SortableJS ----
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

  // Pastroj dhe krijoj itemet (shuffle për testim)
  sortableEl.innerHTML = '';
  const shuffled = shuffle(eventsOrdered.slice());
  shuffled.forEach(ev=>{
    const li = document.createElement('li');
    li.draggable = true; // opsionale sepse Sortable e menaxhon
    li.id = ev.id;
    li.className = 'sortable-item';
    li.textContent = ev.text;
    // parandaloj selektimin e tekstit gjatë drag
    li.addEventListener('selectstart', e => e.preventDefault());
    sortableEl.appendChild(li);
  });

  // Sigurohu që Sortable është ngarkuar
  if(typeof Sortable === 'undefined'){
    console.warn('SortableJS nuk u gjet. Sigurohu që CDN-i u përfshi para script.js.');
  } else {
    // inicializo Sortable
    Sortable.create(sortableEl, {
      animation: 150,
      ghostClass: 'sortable-ghost',
      fallbackOnBody: true,
      swapThreshold: 0.65
      // mund të shtosh event handler për 'end' për debug
      // onEnd: (evt) => console.log('new order:', Array.from(sortableEl.children).map(x=>x.id))
    });
  }

  // Butoni për kontrollim renditjeje (duhet të ekzistojë në HTML me id="submit-order")
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
        if(typeof fireConfetti === 'function') fireConfetti(6);
      } else {
        it.classList.add('wrong');
      }
    });
    // ruaj te scores në indeksin e duhur (nëse scores ekziston)
    if(typeof scores !== 'undefined' && Array.isArray(scores)) scores[3] = s;
    const scoreEl = document.getElementById('score-4');
    if(scoreEl) scoreEl.textContent = s;
  });
})();

  // ---- Ushtrimi 5: Plotëso boshllëqet ----
  const blanks = ["osmanët", "gjuhës", "zakoneve"];
  const bankWords = shuffle(blanks.concat([]));
  const fillBank = document.getElementById('fill-bank');
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
      // place copy inside blank (move element)
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
          // vibrate
          child.animate([{transform:'translateX(0)'},{transform:'translateX(-6px)'},{transform:'translateX(6px)'},{transform:'translateX(0)'}],{duration:450});
        }
      } else {
        b.classList.add('wrong');
      }
    });
    scores[4] = s; // 1 pikë për secilën fjalë të saktë (max 2)
    document.getElementById('score-5').textContent = scores[4];
  });


  // ---- Submit All & Rezultati Final ----
  document.getElementById('submit-all').addEventListener('click', showResults);
  document.getElementById('restart').addEventListener('click', ()=> location.reload());

  function showResults(){
    const total = scores.reduce((a,b)=>a+b,0);
    document.getElementById('total-score').textContent = total;
    // Animacion suksesi
    if(total >= Math.round(maxScore*0.6)){
      fireConfetti(60);
    } else {
      // minor confetti red-ish?
      fireConfetti(20);
    }
    // scroll to summary
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
    timerEl.textContent = `${mm}:${ss}`;
  }, 1000);

  function autoSubmitAll(){
    // attempt to auto-submit each exercise (call the submit handlers)
    document.getElementById('submit-quiz').click();
    document.getElementById('submit-circles').click();
    document.getElementById('submit-inputs').click();
    document.getElementById('submit-order').click();
    document.getElementById('submit-fill').click();
    showResults();
    alert('Koha mbaroi! Rezultati u dorëzua automatikisht.');
  }

  // ---- Confetti (thjeshtë, pa external libs) ----
  const confettiCanvas = document.getElementById('confetti-canvas');
  const confettiCtx = confettiCanvas.getContext('2d');
  let W = confettiCanvas.width = window.innerWidth;
  let H = confettiCanvas.height = window.innerHeight;
  window.addEventListener('resize', ()=>{ W = confettiCanvas.width = window.innerWidth; H = confettiCanvas.height = window.innerHeight; });

  let confettiParticles = [];
  function fireConfetti(count=40){
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
        p.vy += 0.06; // gravity
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
  // update every 1s
  setInterval(updateTotalDisplay, 1000);


// SHTO KETU (brenda document.addEventListener('DOMContentLoaded', ()=>{ ... }))
// ---- Peer assessment (Vlerësimi i Grupit) ----
(function initPeerAssessment(){
  // Mos krijo variabla globale të reja, përdor variabla lokale
  const form = document.getElementById('vleresimiForm');
  if(!form) return; // nëse përdoruesi nuk e ka shtuar seksionin, mos bëj asgjë

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

    // Validime
    if(total !== 10){
      if(errorMessage){
        
        errorMessage.style.display = 'block';
      }
      rezultatiDiv.style.display = 'none';
      return;
    }

    if(emri_aneter_a === ""){
      if(errorMessage){
       
        errorMessage.style.display = 'block';
      }
      rezultatiDiv.style.display = 'none';
      return;
    }

    // Në rregull: shfaq rezultatin
    if(errorMessage) errorMessage.style.display = 'none';

    if(resUne) resUne.textContent = pika_une;
    if(resEmri) resEmri.textContent = emri_aneter_a;
    if(resPika) resPika.textContent = pika_aneter_a;

    rezultatiDiv.style.display = 'block';

    // Opsionale: ruaj rezultatet në localStorage për rifreskim / dërgim
    try {
      const saved = {
        vetja: pika_une,
        anetar: { emri: emri_aneter_a, pike: pika_aneter_a },
        timestamp: new Date().toISOString()
      };
      localStorage.setItem('peerAssessment', JSON.stringify(saved));
    } catch (err) {
      // mos blloko nëse localStorage nuk është i disponueshëm
      // console.warn('LocalStorage not available', err);
    }
  });

  // Opsionale: nëse ka rezultat të ruajtur, ngarko dhe shfaq
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
=======
// Script për logjikën e testit: pyetjet, drag/drop, renditje, plotësime, kohëmatës, confetti
document.addEventListener('DOMContentLoaded', ()=>{

  // ---- KONFIGURIMI I PYETJEVE DHE VLERËSIMI ----
  const maxScore = 30;
  document.getElementById('max-score').textContent = maxScore;

  let scores = [0,0,0,0,0]; // pesë ushtrime

  // Ushtrimi 1: 7 quiz questions
  const quizQuestions = [
    {q:"1.Cili është qytetërimi antik që konsiderohet si parardhës i shqiptarëve?", opts:["a) Grekët","b) Ilirët","c) Dakëti","d)Romakët"], a:3},
    {q:"2.Cili ishte vendbanimi më i njohur i ilirëve në territorin e sotëm të Shqipërisë?  ", opts:["a)Apolonia","b)Dyrrahu","c)Shkodra","d)Butrinti"], a:0},
    {q:"3.Cila ishte arsyeja kryesore e luftërave iliro-romake?", opts:["a)Konfliktet fetare","b)Kontrolli i detit Adriatik","c)Tregtia me Greqinë","d)Shpërnguljet e popullsisë"], a:0},
    {q:"4.Përmend dy elementë të trashëgimisë kulturore që dëshmojnë vazhdimësinë ilire në trevat shqiptare.", opts:["Konferenca e Parisit","Konferenca e Ambasadorëve","Konferenca e Londrës","Konferenca e Versajës"], a:1},
    {q:"5.Cili ishte formacioni politik më i rëndësishëm shqiptar në shek. XIV?  ", opts:["a)Principata e Dukagjinëve","b) Principata e Muzakajve","c)Principata e Balshajve","d)Principata e Topiajve"], a:0},
    {q:"6.Cili ishte qëllimi kryesor i Kuvendit të Lezhës në vitin 1444?  ", opts:["a)Të ndante territoret shqiptare","b)Të bashkonte forcat kundër osmanëve","c)Të zgjidhte një princ të ri ","d)Të nënshkruante paqe me Venedikun"], a:0},
   
    
  ];
  // Shto 7 pyetje të reja në quizQuestions (vendoseni pas deklarimit origjinal të quizQuestions)
quizQuestions.push(
  {
    q: "9.Cila nga këto është një pasojë e pushtimit osman në jetën e shqiptarëve?",
    opts: ["a)Rritja e tregtisë me Evropën ","b)Përhapja e fesë islame ","c)Zhvillimi i qyteteve të pavarura","d)Liria e plotë fetare"],
    a: 0
  },
 
  
);

  // Rnd shuffle helper
  const shuffle = (arr)=> arr.map(v=>({v, r:Math.random()})).sort((a,b)=>a.r-b.r).map(x=>x.v);

  // Rregullo dhe rendit quiz në DOM
  const quizContainer = document.getElementById('quiz-container');
  quizQuestions.forEach((item, idx)=>{
    const div = document.createElement('div');
    div.className = 'quiz-item';
    div.innerHTML = `<strong>Pyetja ${idx+1}:</strong> <div class="qtext">${item.q}</div>`;
    const optsDiv = document.createElement('div');
    optsDiv.className = 'options';
    const opts = shuffle(item.opts.map((o,i)=>({o,i})));
    opts.forEach(opt=>{
      const b = document.createElement('div');
      b.className = 'option';
      b.tabIndex = 0;
      b.dataset.q = idx;
      b.dataset.choice = opt.i;
      b.textContent = opt.o;
      b.addEventListener('click', ()=>selectOption(b));
      optsDiv.appendChild(b);
    });
    div.appendChild(optsDiv);
    quizContainer.appendChild(div);
  });

  function selectOption(el){
    const qIdx = +el.dataset.q;
    // deselect siblings
    const siblings = el.parentElement.querySelectorAll('.option');
    siblings.forEach(s=>s.classList.remove('selected'));
    el.classList.add('selected');
  }

  document.getElementById('submit-quiz').addEventListener('click', ()=>{
    let s = 0;
    // për secilën pyetje shiko përzgjedhjen
    const items = quizContainer.querySelectorAll('.quiz-item');
    items.forEach((it, idx)=>{
      const chosen = it.querySelector('.option.selected');
      const opts = it.querySelectorAll('.option');
      opts.forEach(o => o.classList.remove('correct','wrong'));
      if(chosen){
        const choiceVal = +chosen.dataset.choice;
        if(choiceVal === quizQuestions[idx].a){
          chosen.classList.add('correct');
          s++;
          fireConfetti(15);
        } else {
          chosen.classList.add('wrong');
          // show correct option
          opts.forEach(o=>{ if(+o.dataset.choice === quizQuestions[idx].a) o.classList.add('correct') });
        }
      } else {
        // mark correct visibly
        opts.forEach(o=>{ if(+o.dataset.choice === quizQuestions[idx].a) o.classList.add('correct') });
      }
    });
    scores[0] = s; // 1 pikë per pyetje -> 7 max
    document.getElementById('score-1').textContent = scores[0];
  });


  // ---- Ushtrimi 2: 2 rrethe & drag/drop (5 per rreth) ----
  // Për këtë shembull kemi 10 përgjigje, secila është e detyruar për rrethin A ose B
  const circleData = [
    {id:'p1', text:'Progoni', target:'A'},
    {id:'p2', text:'Strazimiri', target:'A'},
    {id:'p3', text:'Dhimitri', target:'A'},
    {id:'p4', text:'Shkodra', target:'B'},
    {id:'p5', text:'Shqiperia e Veriut', target:'B'},
    {id:'p6', text:'Besimi Katolik', target:'A'},
    {id:'p7', text:'Ne veri kufizohej me Pejen dhe Prizerenin', target:'B'},
    {id:'p8', text:'Kruja', target:'A'},
    {id:'p9', text:'Përpjekje për reforma', target:'B'},
    {id:'p10', text:'Shtrirja Drini-Shkumbin', target:'A'}
  ];
  // Shuffle and add to bank
  const bank = document.getElementById('drag-bank');
  const dragItems = shuffle(circleData.slice());
  dragItems.forEach(it=>{
    const d = document.createElement('div');
    d.className = 'draggable';
    d.draggable = true;
    d.id = it.id;
    d.textContent = it.text;
    d.dataset.target = it.target;
    d.addEventListener('dragstart', dragStart);
    d.addEventListener('dragend', dragEnd);
    bank.appendChild(d);
  });

  // Setup drop areas
  document.querySelectorAll('.drop-area').forEach(area=>{
    area.addEventListener('dragover', e=>{ e.preventDefault(); area.classList.add('over') });
    area.addEventListener('dragleave', e=>{ area.classList.remove('over') });
    area.addEventListener('drop', e=>{
      e.preventDefault();
      area.classList.remove('over');
      const id = e.dataTransfer.getData('text/plain');
      const el = document.getElementById(id);
      if(el) area.appendChild(el);
    });
  });

  function dragStart(e){
    e.dataTransfer.setData('text/plain', e.target.id);
    e.target.classList.add('dragging');
  }
  function dragEnd(e){
    e.target.classList.remove('dragging');
  }

  document.getElementById('submit-circles').addEventListener('click', ()=>{
    // check items inside each circle
    const Aarea = document.querySelector('#circle-A .drop-area');
    const Barea = document.querySelector('#circle-B .drop-area');
    let s = 0;
    // helper to check children
    [Aarea, Barea].forEach(area=>{
      const children = Array.from(area.querySelectorAll('.draggable'));
      children.forEach(ch=>{
        ch.classList.remove('correct','wrong');
        const expected = ch.dataset.target;
        const here = (area.id.includes('A')?'A':'B');
        if(expected === here){
          ch.classList.add('correct');
          s++;
          fireConfetti(8);
        } else {
          ch.classList.add('wrong');
        }
      });
    });
    // items still in bank untreated: mark as wrong if target requires dropping
    const remaining = Array.from(bank.querySelectorAll('.draggable'));
    remaining.forEach(r=>{
      r.classList.remove('correct','wrong');
    });
    scores[1] = s; // 1 pikë për çdo vendosje të saktë (max 10)
    document.getElementById('score-2').textContent = scores[1];
  });


  // ---- Ushtrimi 3: Pyetje me input (përgjigje të shkruara) ----
  const inputQs = [
  { q: "Cili ishte roli i qyteteve ilire në zhvillimin e kulturës? (3 pikë)", a: "1912" },
  { q: "Cilat ishin marrëdhëniet e ilirëve me grekët dhe romakët? (3 pikë)", a: "Vlorë" },
  { q: "Çfarë ndikimi pati pushtimi romak në trevat ilire? (3 pikë)", a: "Ismail Qemali" },
  { q: "Si lidhet kultura ilire me atë shqiptare? (3 pikë)", a: "1920" },
  { q: "Çfarë tregon përhapja e toponimeve ilire në trojet shqiptare? (3 pikë)", a: "Naim Frashëri" },
  { q: "Si ndikuan ilirët në identitetin etnik shqiptar? (4 pikë)", a: "Shpallja e Pavarësisë" },
  { q: "Çfarë roli kishte Kisha në jetën mesjetare shqiptare? (3 pikë)", a: "Vlorë" },
  { q: "Si u formua Principata e Arbërit? (3 pikë)", a: "Ahmet Zogu" },
  { q: "Cila ishte rëndësia e Skënderbeut në Mesjetë? (4 pikë)", a: "Lushnjë" },
  { q: "Çfarë ndikimi pati pushtimi osman në shoqërinë shqiptare? (3 pikë)", a: "1957" },
  { q: "Si u ruajt gjuha dhe kultura shqiptare gjatë pushtimit osman? (4 pikë)", a: "Nënë Tereza" },
  { q: "Si lidhet Mesjeta shqiptare me zhvillimin e identitetit kombëtar? (4 pikë)", a: "2009" }
];
  const inputContainer = document.getElementById('input-questions');
  inputQs.forEach((it, idx)=>{
    const div = document.createElement('div');
    div.className = 'quiz-item';
    div.innerHTML = `<div><strong>Pyetja ${idx+1}:</strong> ${it.q}</div>
      <div style="margin-top:8px"><input type="text" class="text-answer" data-idx="${idx}" placeholder="Shkruaj përgjigjen këtu" style="padding:8px;border-radius:8px;border:1px solid rgba(255,255,255,0.04);width:100%"></div>`;
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
        inp.style.border = `2px solid var(--success)`;
        fireConfetti(10);
      } else {
        inp.style.border = `2px solid var(--danger)`;
        // small shake
        inp.animate([{transform:'translateX(0)'},{transform:'translateX(-6px)'},{transform:'translateX(6px)'},{transform:'translateX(0)'}],{duration:400});
      }
    });
    scores[2] = s; // 1 pikë per përgjigje -> max 3
    document.getElementById('score-3').textContent = scores[2];
  });


  // ---- Ushtrimi 4: Rendit ngjarjet historike ----
  // ---- Ushtrimi 4: Rendit ngjarjet historike me SortableJS ----
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

  // Pastroj dhe krijoj itemet (shuffle për testim)
  sortableEl.innerHTML = '';
  const shuffled = shuffle(eventsOrdered.slice());
  shuffled.forEach(ev=>{
    const li = document.createElement('li');
    li.draggable = true; // opsionale sepse Sortable e menaxhon
    li.id = ev.id;
    li.className = 'sortable-item';
    li.textContent = ev.text;
    // parandaloj selektimin e tekstit gjatë drag
    li.addEventListener('selectstart', e => e.preventDefault());
    sortableEl.appendChild(li);
  });

  // Sigurohu që Sortable është ngarkuar
  if(typeof Sortable === 'undefined'){
    console.warn('SortableJS nuk u gjet. Sigurohu që CDN-i u përfshi para script.js.');
  } else {
    // inicializo Sortable
    Sortable.create(sortableEl, {
      animation: 150,
      ghostClass: 'sortable-ghost',
      fallbackOnBody: true,
      swapThreshold: 0.65
      // mund të shtosh event handler për 'end' për debug
      // onEnd: (evt) => console.log('new order:', Array.from(sortableEl.children).map(x=>x.id))
    });
  }

  // Butoni për kontrollim renditjeje (duhet të ekzistojë në HTML me id="submit-order")
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
        if(typeof fireConfetti === 'function') fireConfetti(6);
      } else {
        it.classList.add('wrong');
      }
    });
    // ruaj te scores në indeksin e duhur (nëse scores ekziston)
    if(typeof scores !== 'undefined' && Array.isArray(scores)) scores[3] = s;
    const scoreEl = document.getElementById('score-4');
    if(scoreEl) scoreEl.textContent = s;
  });
})();

  // ---- Ushtrimi 5: Plotëso boshllëqet ----
  const blanks = ["osmanët", "gjuhës", "zakoneve"];
  const bankWords = shuffle(blanks.concat([]));
  const fillBank = document.getElementById('fill-bank');
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
      // place copy inside blank (move element)
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
          // vibrate
          child.animate([{transform:'translateX(0)'},{transform:'translateX(-6px)'},{transform:'translateX(6px)'},{transform:'translateX(0)'}],{duration:450});
        }
      } else {
        b.classList.add('wrong');
      }
    });
    scores[4] = s; // 1 pikë për secilën fjalë të saktë (max 2)
    document.getElementById('score-5').textContent = scores[4];
  });


  // ---- Submit All & Rezultati Final ----
  document.getElementById('submit-all').addEventListener('click', showResults);
  document.getElementById('restart').addEventListener('click', ()=> location.reload());

  function showResults(){
    const total = scores.reduce((a,b)=>a+b,0);
    document.getElementById('total-score').textContent = total;
    // Animacion suksesi
    if(total >= Math.round(maxScore*0.6)){
      fireConfetti(60);
    } else {
      // minor confetti red-ish?
      fireConfetti(20);
    }
    // scroll to summary
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
    timerEl.textContent = `${mm}:${ss}`;
  }, 1000);

  function autoSubmitAll(){
    // attempt to auto-submit each exercise (call the submit handlers)
    document.getElementById('submit-quiz').click();
    document.getElementById('submit-circles').click();
    document.getElementById('submit-inputs').click();
    document.getElementById('submit-order').click();
    document.getElementById('submit-fill').click();
    showResults();
    alert('Koha mbaroi! Rezultati u dorëzua automatikisht.');
  }

  // ---- Confetti (thjeshtë, pa external libs) ----
  const confettiCanvas = document.getElementById('confetti-canvas');
  const confettiCtx = confettiCanvas.getContext('2d');
  let W = confettiCanvas.width = window.innerWidth;
  let H = confettiCanvas.height = window.innerHeight;
  window.addEventListener('resize', ()=>{ W = confettiCanvas.width = window.innerWidth; H = confettiCanvas.height = window.innerHeight; });

  let confettiParticles = [];
  function fireConfetti(count=40){
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
        p.vy += 0.06; // gravity
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
  // update every 1s
  setInterval(updateTotalDisplay, 1000);


// SHTO KETU (brenda document.addEventListener('DOMContentLoaded', ()=>{ ... }))
// ---- Peer assessment (Vlerësimi i Grupit) ----
(function initPeerAssessment(){
  // Mos krijo variabla globale të reja, përdor variabla lokale
  const form = document.getElementById('vleresimiForm');
  if(!form) return; // nëse përdoruesi nuk e ka shtuar seksionin, mos bëj asgjë

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

    // Validime
    if(total !== 10){
      if(errorMessage){
        
        errorMessage.style.display = 'block';
      }
      rezultatiDiv.style.display = 'none';
      return;
    }

    if(emri_aneter_a === ""){
      if(errorMessage){
       
        errorMessage.style.display = 'block';
      }
      rezultatiDiv.style.display = 'none';
      return;
    }

    // Në rregull: shfaq rezultatin
    if(errorMessage) errorMessage.style.display = 'none';

    if(resUne) resUne.textContent = pika_une;
    if(resEmri) resEmri.textContent = emri_aneter_a;
    if(resPika) resPika.textContent = pika_aneter_a;

    rezultatiDiv.style.display = 'block';

    // Opsionale: ruaj rezultatet në localStorage për rifreskim / dërgim
    try {
      const saved = {
        vetja: pika_une,
        anetar: { emri: emri_aneter_a, pike: pika_aneter_a },
        timestamp: new Date().toISOString()
      };
      localStorage.setItem('peerAssessment', JSON.stringify(saved));
    } catch (err) {
      // mos blloko nëse localStorage nuk është i disponueshëm
      // console.warn('LocalStorage not available', err);
    }
  });

  // Opsionale: nëse ka rezultat të ruajtur, ngarko dhe shfaq
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
>>>>>>> 2a9769bfb8782e6a3fb93fa60bd7eab293b70898
});