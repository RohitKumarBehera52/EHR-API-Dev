const loginForm = document.getElementById('login-form');
const summaryForm = document.getElementById('summary-form');
const authStatus = document.getElementById('auth-status');
const summaryStatus = document.getElementById('summary-status');
const summarySections = document.getElementById('summary-sections');

let accessToken = '';

function setMessage(element, message, variant = 'muted') {
  element.textContent = message;
  element.className = `inline-message ${variant}`;
}

function setAuthStatus(message, isError = false) {
  authStatus.textContent = message;
  authStatus.style.color = isError ? 'var(--danger)' : 'var(--brand-strong)';
}

function formatFallback(value) {
  return value || 'Not available';
}

function renderKeyValueList(targetId, items) {
  const container = document.getElementById(targetId);
  container.innerHTML = `
    <div class="fact-list">
      ${items
        .map(
          (item) => `
            <div class="data-row">
              <span class="data-label">${item.label}</span>
              <strong>${formatFallback(item.value)}</strong>
            </div>
          `
        )
        .join('')}
    </div>
  `;
}

function renderEntryList(targetId, items, emptyMessage) {
  const container = document.getElementById(targetId);

  if (!items.length) {
    container.innerHTML = `<p class="muted">${emptyMessage}</p>`;
    return;
  }

  container.innerHTML = `
    <div class="data-list">
      ${items
        .map(
          (item) => `
            <div class="entry">
              <strong>${item.title}</strong>
              <p>${item.body}</p>
            </div>
          `
        )
        .join('')}
    </div>
  `;
}

function renderSummary(summary) {
  const demographics = summary.demographics;

  renderKeyValueList('demographics', [
    { label: 'Name', value: `${demographics.firstName} ${demographics.lastName}` },
    { label: 'DOB', value: demographics.dateOfBirth },
    { label: 'Gender', value: demographics.gender },
    { label: 'Phone', value: demographics.phone },
    { label: 'Blood Group', value: demographics.bloodGroup }
  ]);

  renderEntryList(
    'encounters',
    summary.latestEncounters.map((encounter) => ({
      title: `${encounter.visitType} on ${new Date(encounter.visitDate).toLocaleString()}`,
      body: `${encounter.chiefComplaint}. Provider: ${formatFallback(encounter.providerId)}`
    })),
    'No encounters found.'
  );

  renderEntryList(
    'diagnoses',
    summary.diagnoses.map((diagnosis) => ({
      title: diagnosis.description,
      body: `Code: ${formatFallback(diagnosis.code)} | Encounter: ${diagnosis.encounterId}`
    })),
    'No diagnoses found.'
  );

  renderEntryList(
    'medications',
    summary.activeMedications.map((medication) => ({
      title: medication.drugName,
      body: `${medication.dosage}, ${medication.frequency}, ${medication.route}`
    })),
    'No active medications found.'
  );

  renderEntryList(
    'allergies',
    summary.allergies.map((allergy) => ({
      title: allergy.allergen,
      body: `${allergy.reaction} | Severity: ${allergy.severity}`
    })),
    'No allergies found.'
  );

  renderEntryList(
    'labs',
    summary.recentLabResults.map((lab) => ({
      title: lab.testName,
      body: `${lab.resultValue} ${lab.unit} | Status: ${lab.status}`
    })),
    'No lab results found.'
  );

  renderEntryList(
    'imaging',
    summary.imagingReferences.map((imaging) => ({
      title: `${imaging.studyName} (${imaging.modality})`,
      body: `${imaging.impression} | ${imaging.imageUrl}`
    })),
    'No imaging records found.'
  );
}

loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  setAuthStatus('Signing in...');

  const payload = {
    username: document.getElementById('username').value.trim(),
    password: document.getElementById('password').value
  };

  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }

    accessToken = data.data.accessToken;
    setAuthStatus(`Signed in as ${data.data.user.username}`);
  } catch (error) {
    accessToken = '';
    setAuthStatus(error.message, true);
  }
});

summaryForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const patientId = document.getElementById('patientId').value.trim();
  const token = accessToken.trim();

  if (!token) {
    setMessage(summaryStatus, 'Please sign in first before loading a patient summary.', 'error');
    summarySections.classList.add('hidden');
    return;
  }

  setMessage(summaryStatus, 'Loading patient summary...', 'muted');

  try {
    const response = await fetch(`/api/patients/${encodeURIComponent(patientId)}/summary`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Unable to load patient summary');
    }

    renderSummary(data.data);
    summarySections.classList.remove('hidden');
    setMessage(summaryStatus, 'Patient summary loaded successfully.', 'success');
  } catch (error) {
    summarySections.classList.add('hidden');
    setMessage(summaryStatus, error.message, 'error');
  }
});
