const patientForm = document.querySelector('#patient-form');
const searchForm = document.querySelector('#search-form');
const encounterForm = document.querySelector('#encounter-form');
const patientsList = document.querySelector('#patients-list');
const encountersList = document.querySelector('#encounters-list');
const toast = document.querySelector('#toast');
const patientCount = document.querySelector('#patient-count');

function showToast(message, isError = false) {
  toast.textContent = message;
  toast.classList.toggle('error', isError);
  toast.classList.add('visible');

  window.setTimeout(() => {
    toast.classList.remove('visible');
  }, 3200);
}

function formToObject(form) {
  return Object.fromEntries(
    Array.from(new FormData(form).entries())
      .map(([key, value]) => [key, typeof value === 'string' ? value.trim() : value])
      .filter(([, value]) => value !== '')
  );
}

async function apiRequest(path, options = {}) {
  const response = await fetch(path, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    },
    ...options
  });
  const payload = await response.json();

  if (!response.ok) {
    const details = payload.errors?.map((error) => error.message).join(', ');
    throw new Error(details || payload.message || 'Request failed');
  }

  return payload;
}

function renderPatients(patients) {
  patientCount.textContent = patients.length;

  if (patients.length === 0) {
    patientsList.innerHTML = '<p class="empty-state">No patients found.</p>';
    return;
  }

  patientsList.innerHTML = patients.map((patient) => `
    <article class="record">
      <div class="record-header">
        <div>
          <h3>${patient.firstName} ${patient.lastName}</h3>
          <p class="record-id">${patient.patientId}</p>
        </div>
        <button type="button" data-copy-patient="${patient.patientId}">Use ID</button>
      </div>
      <div class="meta">
        <span class="pill">${patient.dateOfBirth}</span>
        <span class="pill">${patient.gender}</span>
        <span class="pill">${patient.phone}</span>
        ${patient.bloodGroup ? `<span class="pill">${patient.bloodGroup}</span>` : ''}
      </div>
      <p>${patient.email || 'No email'}${patient.address ? ` - ${patient.address}` : ''}</p>
    </article>
  `).join('');
}

function renderEncounters(encounters) {
  if (encounters.length === 0) {
    encountersList.innerHTML = '<p class="empty-state">No encounters recorded for this patient yet.</p>';
    return;
  }

  encountersList.innerHTML = encounters.map((encounter) => `
    <article class="record">
      <div class="record-header">
        <div>
          <h3>${encounter.chiefComplaint}</h3>
          <p class="record-id">${encounter.encounterId}</p>
        </div>
        <span class="pill">${encounter.visitDate}</span>
      </div>
      <p>Provider: ${encounter.providerId} - ${encounter.visitType}</p>
      <p>${encounter.diagnoses.map((diagnosis) => diagnosis.description).join(', ')}</p>
    </article>
  `).join('');
}

async function loadPatients(query = '') {
  const payload = await apiRequest(`/api/patients${query}`);
  renderPatients(payload.data);
}

async function loadEncounters(patientId) {
  const payload = await apiRequest(`/api/patients/${encodeURIComponent(patientId)}/encounters`);
  renderEncounters(payload.data);
}

patientForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  try {
    const patient = formToObject(patientForm);
    const payload = await apiRequest('/api/patients', {
      method: 'POST',
      body: JSON.stringify(patient)
    });

    patientForm.reset();
    showToast(`Created patient ${payload.data.patientId}`);
    await loadPatients();
  } catch (error) {
    showToast(error.message, true);
  }
});

searchForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  try {
    const params = new URLSearchParams(formToObject(searchForm));
    await loadPatients(params.toString() ? `?${params.toString()}` : '');
  } catch (error) {
    showToast(error.message, true);
  }
});

encounterForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  try {
    const data = formToObject(encounterForm);
    const patientId = data.patientId;
    const encounter = {
      providerId: data.providerId,
      visitDate: data.visitDate,
      visitType: data.visitType,
      chiefComplaint: data.chiefComplaint,
      clinicalNotes: data.clinicalNotes,
      diagnoses: [
        {
          code: data.diagnosisCode,
          description: data.diagnosisDescription,
          type: 'primary'
        }
      ]
    };

    await apiRequest(`/api/patients/${encodeURIComponent(patientId)}/encounters`, {
      method: 'POST',
      body: JSON.stringify(encounter)
    });

    showToast('Encounter saved');
    await loadEncounters(patientId);
  } catch (error) {
    showToast(error.message, true);
  }
});

patientsList.addEventListener('click', async (event) => {
  const button = event.target.closest('[data-copy-patient]');

  if (!button) {
    return;
  }

  const patientId = button.dataset.copyPatient;
  encounterForm.elements.patientId.value = patientId;

  try {
    await loadEncounters(patientId);
    showToast(`Loaded ${patientId}`);
  } catch (error) {
    showToast(error.message, true);
  }
});

loadPatients().catch((error) => {
  showToast(error.message, true);
});
