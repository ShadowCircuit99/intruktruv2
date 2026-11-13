/* ================================================================
   ONBOARDING 3-STEP -- Data → Tujuan → Makanan
   ================================================================ */

let currentStep = 1;
const formGroups = document.querySelectorAll('.form-group');

function setStep(step) {
  if (step < 1 || step > 3) return;
  if (!validateCurrentStep()) return;
  showStep(step);
}

function showStep(step) {
  currentStep = step;
  // Update step navigation active state
  document.querySelectorAll('.onboard-step').forEach((el, i) => {
    el.classList.toggle('active', i + 1 === step);
  });
  // Show/hide form sections based on step
  formGroups.forEach(el => {
    const dataStep = el.getAttribute('data-step');
    if (dataStep !== null) {
      el.style.display = (dataStep === String(step)) ? 'block' : 'none';
    }
  });
  // Enable/disable nav buttons
  document.querySelectorAll('.onboard-nav .btn-btn').forEach((el, i) => {
    el.disabled = i + 1 !== step;
  });
}

function nextStep() {
  if (currentStep < 3 && validateCurrentStep()) {
    showStep(currentStep + 1);
  }
}

function prevStep() {
  if (currentStep > 1) {
    showStep(currentStep - 1);
  }
}

function validateCurrentStep() {
  if (currentStep === 1) return validateDataStep();
  if (currentStep === 2) return validateGoalStep();
  if (currentStep === 3) return validateMakananStep();
  return true;
}

function validateDataStep() {
  let valid = true;
  const fields = [
    {id:'f-name', errId:'err-name', check:v=>validasiNama(v), errTxt:'Masukkan nama lengkap (min 2 huruf).'},
    {id:'f-weight', errId:'err-weight', check:v=>{var r=validasiAngka(v,30,200,'Berat badan');return r.valid;}, errTxt:'Berat badan 30-200 kg.'},
    {id:'f-target-weight', errId:'err-target', check:v=>{var r=validasiAngka(v,30,200,'Target berat');return r.valid;}, errTxt:'Target berat 30-200 kg.'},
    {id:'f-height', errId:'err-height', check:v=>{var r=validasiAngka(v,100,250,'Tinggi badan');return r.valid;}, errTxt:'Tinggi badan 100-250 cm.'},
    {id:'f-age', errId:'err-age', check:v=>{var r=validasiAngka(v,15,80,'Usia');return r.valid;}, errTxt:'Usia 15-80 tahun.'},
    {id:'f-gender', errId:'err-gender', check:v=>v!==''},
    {id:'f-activity', errId:'err-activity', check:v=>v!==''},
  ];
  fields.forEach(f => {
    const el = document.getElementById(f.id);
    const errEl = document.getElementById(f.errId);
    if(!el||!errEl) return;
    const ok = f.check(el.value);
    el.classList.toggle('input-error',!ok);
    if(!ok){
      errEl.innerHTML = '';
      errEl.appendChild(document.createTextNode(f.errTxt||'Isi data dengan benar.'));
      errEl.style.display = 'flex';
    } else {
      errEl.textContent = '';
      errEl.style.display = 'none';
    }
    if(!ok) valid = false;
  });
  const w = +document.getElementById('f-weight').value;
  const t = +document.getElementById('f-target-weight').value;
  if(w>0&&t>0&&Math.abs(w-t)>20){
    document.getElementById('safety-warning').classList.add('show');
    document.getElementById('f-target-weight').classList.add('input-error');
    valid = false;
  } else {
    document.getElementById('safety-warning').classList.remove('show');
  }
  return valid;
}

function validateGoalStep() {
  const goalErr = document.getElementById('err-goal');
  if(!selectedGoal){
    if(goalErr){
      goalErr.textContent = 'Pilih tujuan kamu dulu.';
      goalErr.style.display = 'flex';
    }
    return false;
  } else if(goalErr){
    goalErr.textContent = '';
    goalErr.style.display = 'none';
  }
  return true;
}

function validateMakananStep() {
  const chips = document.querySelectorAll('.dislike-chip.selected');
  const hasSelection = chips.length > 0;
  const chipsMsg = document.getElementById('err-goal');
  if(!hasSelection){
    if(chipsMsg){
      chipsMsg.textContent = 'Pilih minimal 1 bahan yang dihindari.';
      chipsMsg.style.display = 'flex';
    }
    return false;
  } else if(chipsMsg){
    chipsMsg.textContent = '';
    chipsMsg.style.display = 'none';
  }
  return true;
}